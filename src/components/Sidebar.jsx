import { useEffect, useState } from "react";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Search,
    Plus,
    Settings,
    Menu,
    Trash2,
    Ellipsis,
    Download,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
// import { 
//     getAllSessions, 
//     createNewSession, 
//     getCurrentSession,
//     getExperiments,
//     deleteSession,
//     setCurrentSessionId
// } from "@/utils/database";
import { useExperiments } from "@/context/ExperimentContext";
import useTypingEffect from "./hooks/useTypingEffect";
import { useParams, useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/utils/utils";
import { useDeleteData, useGetData, usePostData, usePutData } from "@/lib/queries";


export default function Sidebar() {
    const router = useRouter();
    const params = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSession] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { setExperiments } = useExperiments();
    const { data, refetch } = useGetData("/sessions", ["sessions"]);
    const sessionIdToUse = currentSessionId || params?.id;
    const { data: exp, refetch: refresh } = useGetData(`/experiments/${sessionIdToUse}/sessions`, ["experiments"], {
        enabled: !!sessionIdToUse
    });
    const { mutate: createNewSession } = usePostData("/sessions", ["add-sessions"]);
    const { mutate: updateCurrentSession } = usePutData((ses) => `/sessions/${ses?.id}/current`, ["update-current-session"])
    const { data: sessionData, isLoading: sessionState } = useGetData("/sessions/current", ["current-session"]);
    const { mutate: deleteSession } = useDeleteData((ses) => `/sessions/${ses?.id}`, ["delete-session"]);

    useEffect(() => {
        setSessions(data?.data);
    }, [data]);

    useEffect(() => {
        setCurrentSession(sessionData?.data?.id);
    }, [sessionData]);

    useEffect(() => {
        if (sessionIdToUse) {
            setExperiments(exp?.data);
        }
    }, [exp, sessionIdToUse]);

    const handleNewChat = async () => {
        await createNewSession({}, {
            onSuccess: (newSession) => {
                setCurrentSession(newSession.id);
                setExperiments([]);
                refetch();
                setIsOpen(false);
            }
        });
    };

    const handleSelectSession = (sessionId) => {
        const found = sessions.find((s) => s.id === sessionId);
        if (!found) return;

        // update UI and server at the same time
        setCurrentSession(found?.id);
        updateCurrentSession({ id: found?.id });
        setExperiments([]);

        refresh().then((newData) => {
            if (newData?.data) {
                setExperiments(newData.data?.data);
            }
        });
    };

    const handleDeleteSession = (sessionId, e) => {
        e.stopPropagation();
        
        if (sessionId === currentSessionId) {
            const remainingSessions = sessions?.filter(s => s.id !== sessionId);
            
            if (remainingSessions.length > 0) {
                const lastSession = remainingSessions[0];
                setCurrentSession(lastSession.id);
            } else {
                handleNewChat();
            }
            setSessions(remainingSessions);
        }
        
        deleteSession({ id: sessionId });
    };

    const filteredSessions = sessions?.filter(session =>
        session?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <>
            {!isOpen && (
                <div className="lg:hidden fixed top-4 left-4 z-50">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsOpen(!isOpen)}
                        className="rounded-full bg-white dark:bg-gray-900 shadow-md"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed lg:static z-40 flex flex-col w-72 h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transform transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
            >
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                            Gen Ai
                        </h2>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={handleNewChat}
                                        className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Add Session</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex-1 overflow-hidden px-4">
                        <Tabs defaultValue="all" orientation="vertical" className="w-full">
                            <TabsList className="w-full bg-slate-200">
                                <TabsTrigger value="all" >All</TabsTrigger>
                                <TabsTrigger value="pinned">Pinned</TabsTrigger>
                            </TabsList>

                            <TabsContent value="all" className="mt-2">
                                <div className="pb-2 w-full">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search conversations..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
                                        />
                                    </div>
                                </div>

                                <div className="w-full h-[calc(100vh-220px)] py-2 overflow-y-scroll">
                                    {filteredSessions?.length === 0 ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                                            {searchQuery ? "No matching conversations" : "No conversations yet"}
                                        </p>
                                    ) : (
                                        <div className="space-y-1">
                                            {filteredSessions.map((session) => (
                                                <SidebarItem
                                                    key={session.id}
                                                    session={session}
                                                    isActive={session.id === currentSessionId}
                                                    onClick={() => handleSelectSession(session.id)}
                                                    onDelete={(e) => handleDeleteSession(session.id, e)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="pinned" className="mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400 px-2">
                                    Pinned contents here
                                </p>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* --- Bottom Section --- */}
                <div className="mt-auto">
                    <Separator />
                    <div className="flex items-center justify-between px-4 py-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Settings</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden z-30"
                />
            )}
        </>
    );
}

const SidebarItem = ({ session, isActive, onClick, onDelete }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const isNewSession = () => {
        const createdAt = new Date(session.created_at);
        const now = new Date();
        return (now - createdAt) < 5000; // 5 seconds
    };

    // Use typing effect for new sessions only
    const displayTitle = useTypingEffect(
        isNewSession() ? session?.title : ""
    );

    const title = isNewSession() ? displayTitle : session?.title;

    return (
        <div
            onClick={onClick}
            className={`w-full flex items-center justify-between cursor-pointer px-3 py-2 rounded-md text-left hover:bg-slate-100 dark:hover:bg-gray-800 group
                ${isActive 
                    ? "bg-slate-50 dark:bg-gray-800" 
                    : "hover:bg-slate-100 dark:hover:bg-gray-800"
                }`}
        >
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate block  w-full">
                    {capitalizeFirstLetter(title)}
                    {isNewSession() && displayTitle.length < session.title.length && (
                        <span className="animate-pulse">|</span>
                    )}
                </span>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Ellipsis className="h-4 w-4 text-gray-800 opacity-0 group-hover:opacity-100 transition flex-shrink-0" />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-x-2 mb-1 cursor-pointer">
                        <Download className="size-4" /> Export
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 flex items-center gap-x-2 cursor-pointer hover:bg-red-50 hover:text-red-600 transition" onClick={() => setOpenDialog(true)}>
                        <Trash2 className="size-4 text-red-600" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your conversations
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDelete}
                        >Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
