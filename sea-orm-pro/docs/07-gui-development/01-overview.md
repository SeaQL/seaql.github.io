# Overview

:::tip SeaORM Pro Plus

<br/>

SeaORM Pro is free-to-use software. All backend source code is MIT Licensed, but the frontend source code is closed for the time being.

[SeaORM Pro Plus](https://github.com/SeaQL/sea-orm-pro-plus) provides additional features and access to the frontend source code.

:::

## Tech Stack

* [UmiJS](https://umijs.org/): An extensible enterprise-level front-end routing framework
* [Ant Design](https://ant.design/): An UI component framework to enrich your web application
* [Ant Design Pro](https://pro.ant.design/): A production-ready UI component for admin dashboard application
* [Ant Design Charts](https://ant-design-charts.antgroup.com/): An enterprise data visualization library

## Folder Structure

```
pro_admin_frontend
├── config                     # Configuration of UmiJS
├── public                     # Static assets
├── src
│   ├── components             # React components: header, menu and footer
│   ├── locales                # i18n files
│   ├── pages                  # Frontend view template files
│   │   ├── User               # Login view
│   │   ├── composite-table    # Composite table view
│   │   └── table              # Raw table view
└── types                      # Typescript declaration files
```

## Customization

There are few UI components you might want to customize:

### Header

Customize the header.

```tsx title=pro_admin_frontend/src/app.tsx
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [
      <GraphqlPlayground key="GraphqlPlayground" />,
      <ToggleTheme key="ToggleTheme" />,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
  }
}
```

### Menu

Customize the routing.

```ts title=pro_admin_frontend/config/routes.ts
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    key: 'dashboard',
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'Dashboard',
    component: './Dashboard',
  },
  {
    key: 'raw_table',
    name: 'Raw Tables',
    icon: 'Database',
    path: '/table',
    component: './table/index',
  },
  {
    path: '/table/:table',
    component: './table/$table',
  },
  {
    key: 'composite_table',
    name: 'Composite Tables',
    icon: 'Apartment',
    path: '/composite-table',
    component: './composite-table/index',
  },
  {
    path: '/composite-table/:table',
    component: './composite-table/$table',
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
```

### Footer

Customize the copyright message.

```tsx title=pro_admin_frontend/src/components/Footer/index.tsx
const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="Powered by SeaORM Pro"
    />
  );
};
```

### Login Page

Customize how the login in is handled.

```tsx title=pro_admin_frontend/src/pages/User/Login/index.tsx
const handleAccountLogin = async (values: API.LoginParams) => {
  try {
    const msg = await passwordLogin({ email: values.username, password: values.password });
    if (msg.token) {
      localStorage.setItem('auth_token', msg.token);
      const defaultLoginSuccessMessage = intl.formatMessage({ id: 'pages.login.success' });
      message.success(defaultLoginSuccessMessage);
      await fetchUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      return;
    }
    setUserLoginState(msg);
  } catch (error) {
    const defaultLoginFailureMessage = intl.formatMessage({ id: 'pages.login.failure' });
    message.error(defaultLoginFailureMessage);
  }
};
```
