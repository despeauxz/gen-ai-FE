// utils/axiosInstance.js
import axios from "axios";
import { toast } from "sonner";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

let pendingQueue = [];
const isClient = typeof window !== "undefined";
const toastIds = {
  offline: null,
  rateLimit: null,
};

// Retry all queued requests when network returns
if (isClient) {
  window.addEventListener("online", async () => {
    console.log("🟢 Network back online. Retrying pending requests...");
    const queue = [...pendingQueue];
    pendingQueue = [];
    for (const { resolve, reject, config } of queue) {
      try {
        const response = await axiosInstance(config);
        resolve(response);
      } catch (err) {
        reject(err);
      }
    }
  });
}

const isOffline = () => !window.navigator.onLine;


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle offline scenario
        if (isOffline()) {
            console.warn("🔴 Offline. Request queued for retry:", originalRequest.url);
            return new Promise((resolve, reject) => {
                pendingQueue.push({ resolve, reject, config: originalRequest });
            });
        }

        if (error.response && error.response.status === 429) {
          const retryAfter =
            error.response.headers["retry-after"] ||
            error.response.data?.retryAfter ||
            60; // fallback: 60s if server doesn’t specify

          if (!toastIds.rateLimit) {
            toastIds.rateLimit = toast("Too many requests", {
              description: `Please slow down. You can try again in ${retryAfter} seconds.`,
              position: "top-center",
              duration: retryAfter * 1000,
              onAutoClose: () => (toastIds.rateLimit = null),
            });
          }

          // Optionally retry automatically after cooldown:
          // (comment this out if you don’t want auto-retry)
          return new Promise((resolve, reject) => {
            setTimeout(async () => {
              try {
                const res = await axiosInstance(originalRequest);
                resolve(res);
              } catch (err) {
                reject(err);
              } finally {
                // clean up toast after retry
                if (toastIds.rateLimit) {
                  toast.dismiss(toastIds.rateLimit);
                  toastIds.rateLimit = null;
                }
              }
            }, retryAfter * 1000);
          });
        }

        return Promise.reject(error);
    }
);

export { axiosInstance };
