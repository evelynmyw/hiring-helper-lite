# Dashboard 用户菜单

## 要实现的内容
- 将侧边栏左下角的用户栏改为整块可点击。
- 点击后向上展开账户菜单，显示当前用户头像、姓名和邮箱。
- 菜单包含 Profile、Inbox、Settings、Support、Community、Switch account 和 Sign out，并使用对应图标和分组分隔线。
- Switch account 会安全退出当前账号并回到登录页；Sign out 沿用现有的缓存清理和安全退出流程。
- 保持现有浅色、深色主题以及侧边栏布局。

## 技术细节
- 复用项目现有的下拉菜单和按钮组件，菜单定位在用户栏上方并与侧边栏宽度对齐。
- 未提供对应页面的 Profile、Inbox、Settings、Support、Community 暂作为菜单入口展示，不新增页面或业务数据。
