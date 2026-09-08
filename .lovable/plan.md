# 给 Tara 加上 HR 账号系统

每位 HR 用邮箱 + 密码登录，登录后才能进入 Dashboard 等内部页面；侧边栏底部显示真实的登录用户，并可以退出登录。用户数据存在你自己的后端，前端不额外接任何云服务。

## 用户能看到的变化

1. **注册 / 登录页**：首页的 "Log in" 按钮进入登录页；登录页可切换到注册（邮箱、姓名、密码）。
2. **登录后跳转**：成功后进入 Dashboard；若之前想访问某个内部页面，则回到那个页面。
3. **内部页面需要登录**：Dashboard、Jobs、Candidates、Screening、Employee、Schedule、Analytics 未登录会跳回登录页。首页保持公开。
4. **侧边栏用户卡片**：显示真实姓名和邮箱（不再写死 Evelyn），带「退出登录」。
5. **顶部导航**：未登录只显示 Home 和 Log in；已登录显示各页面入口和当前用户。
6. **错误提示**：邮箱已注册、密码错误、后端不可用都会在表单上给出清楚的提示。

## 你需要在后端实现的接口

前端会调用 `VITE_API_BASE_URL` 下的这几个接口，返回 JSON。密码务必在后端用 bcrypt/argon2 哈希存储，绝不要明文。

```text
POST /auth/register
  body: { "email": "a@b.com", "name": "Evelyn", "password": "..." }
  200:  { "access_token": "<jwt>", "token_type": "bearer",
          "user": { "id": "...", "email": "a@b.com", "name": "Evelyn" } }
  409:  { "detail": "Email already registered" }

POST /auth/login
  body: { "email": "a@b.com", "password": "..." }
  200:  同上（access_token + user）
  401:  { "detail": "Invalid email or password" }

GET  /auth/me
  header: Authorization: Bearer <jwt>
  200:  { "id": "...", "email": "...", "name": "..." }
  401:  { "detail": "Not authenticated" }

POST /auth/logout        (可选)
  header: Authorization: Bearer <jwt>
  200:  { "ok": true }
```

后端建议：一张 `users` 表（id、email 唯一、name、password_hash、created_at），JWT 有效期 7 天，CORS 允许前端来源并放行 `Authorization` 头。若你的字段名不一样，告诉我，我按你的改。

## 前端要做的改动（技术细节）

- `src/lib/auth.ts`：token 存在 `localStorage`（key `tara_token`），提供 `register`、`login`、`fetchMe`、`logout`；错误按状态码转成中文/英文可读消息。
- `src/lib/api.ts`：`post` 辅助自动带上 `Authorization: Bearer <token>`；收到 401 时清 token 并跳登录页。
- `src/components/AuthProvider.tsx`：React context 保存 `user` / `status`（`loading` / `signed-in` / `signed-out`），启动时调用 `/auth/me` 恢复会话；在 `__root.tsx` 里包住 `QueryClientProvider` 内部。
- `src/routes/auth.tsx`：新增 `/auth` 路由，邮箱+密码表单，登录/注册二选一切换，沿用 glass + 渐变风格，含 light/dark 两套配色。
- 路由保护：现有页面文件保持不变，在各页组件外包一层 `<RequireAuth>`（`status === 'loading'` 显示骨架，`signed-out` 用 `navigate` 跳 `/auth?redirect=...`）。这样不用移动文件、不会引起路由冲突。
- `src/components/AppSidebar.tsx`：底部卡片读 context 里的 `user`，首字母头像取姓名首字，加 `LogOut` 按钮 —— 退出时清 token、清 React Query 缓存、跳 `/auth`。
- `src/routes/__root.tsx`：导航根据登录状态显隐，"Log in" 指向 `/auth`。
- `src/routes/index.tsx`：CTA 已登录指向 `/dashboard`，未登录指向 `/auth`。

## 说明

后端代码不在这个项目里，我只能改前端。你按上面的接口规格实现后端后，前端即可直接对接；在后端就绪前，登录页会显示「无法连接服务器」的提示。
