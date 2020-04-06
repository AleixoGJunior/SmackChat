const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "SmackChat",
        component: () => import("pages/PageUsers.vue"),
      },
      {
        path: "/chat/:otherUserId",
        name: "Chat",
        component: () => import("pages/PageChat.vue"),
      },
      {
        path: "/auth",
        name: "Login",
        component: () => import("pages/PageAuth.vue"),
      },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue"),
  });
}

export default routes;
