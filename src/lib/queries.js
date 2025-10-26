import { useQuery, useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "./axios.js";

export const useGetData = (endpoint, queryKey, options = {}) => {
    return useQuery(
        queryKey,
        async () => {
            const response = await axiosInstance.get(endpoint, {
                params: options.params,
            });
            return response?.data;
        },
        options
    );
};

export const usePostData = (endpoint, queryKey) => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data) => {
            const response = await axiosInstance.post(endpoint, data);
            return response.data.data;
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(queryKey);
            },
        }
    );
};

export const usePutData = (endpoint, queryKey) => {
    const queryClient = useQueryClient();

    return useMutation(
        async (variables) => {
            const { data, ...rest } = variables || {};

            const url =
                typeof endpoint === "function" ? endpoint(variables) : endpoint;

            const response = await axiosInstance.put(url, data ?? variables);
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(queryKey);
            },
        }
    );
};

export const usePatchData = (endpoint, queryKey) => {
    const queryClient = useQueryClient();

    return useMutation(
        async (variables) => {
            const { data, ...rest } = variables || {};

            const url =
                typeof endpoint === "function" ? endpoint(variables) : endpoint;

            const response = await axiosInstance.patch(url, data ?? variables);
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(queryKey);
            },
        }
    );
};

export const useDeleteData = (getEndpoint, queryKey) => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data) => {
            const finalEndpoint = typeof getEndpoint === "function" ? getEndpoint(data) : getEndpoint;
            const response = await axiosInstance.delete(finalEndpoint, {
                data,
            });
            return response?.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(queryKey);
            },
        }
    );
};
