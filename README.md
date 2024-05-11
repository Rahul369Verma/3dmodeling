# 3D Modeling

# 1. Backend ( Django Python  )
- This project build with Django framework with Django Rest Framework APIs consumed in NextJS Frontend Framework.

### Packages 
- `Django` =>  Django web framework
- `Django Allauth` => Allow us to login with multiple accounts
- `Django Cors Headers` => API Security for frontend application.
- `Django Rest Framework` => Providing Rest APIs.

## Getting Started

### First, create your virtual-environment for your local development server:

```bash
python -m venv venv

```
### Move to your virtual environment
```
source venv/Script/activate
```

### Install python packages
```
pip install -r requirements.txt
```

### Run Migrations
```
python manage.py migrate
```

### Run Application server
```
python manage.py runserver
```

Open [http://localhost:8000](http://localhost:8000) with your browser to run django app.

---

# 2. Frontend ( NextJS | ReactJS  )
### Packages 
- `Axiox` => Calling an Django RestAPIs.
- `TailwindCSS` => Tailwind Design framework to design an frontend application.

#### This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.


