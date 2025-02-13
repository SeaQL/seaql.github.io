import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageMascot from '../components/HomepageMascot';

import { IoIosFlash } from "react-icons/io";
import { FaReact } from "react-icons/fa";
import { GrGraphQl } from "react-icons/gr";
import { FiDatabase } from "react-icons/fi";
import { MdBackupTable, MdCode, MdSpeed } from "react-icons/md";

function HomepageHeader() {
  return (
    <section class="relative flex max-w-7xl flex-col gap-12 md:mt-10 md:block md:max-w-none sm:mt-10">
      <div class="md:absolute md:flex md:h-full md:w-full md:items-center">
        <div class="px-8 md:mx-auto md:w-full md:max-w-7xl">
          <div class="md:w-3/5 md:pr-8 xl:w-1/2 xl:pr-12">
            <h1 class="text-4xl font-bold text-gray-800 dark:text-white md:text-5xl">
              Effortless Admin Panel
            </h1>
            <p class="mt-8 text-lg font-medium text-gray-600 dark:text-gray-400">
              Build professional admin panels with SeaORM Pro.
            </p>
            <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <a href="docs/install-and-config/getting-started-loco/" class="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-gradient-to-br from-green-300 to-blue-green-300 px-6 py-3.5 text-center font-semibold text-gray-900 transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300/50 sm:w-auto sm:px-8 request-license-btn hover-btn">
                Getting Started
              </a>
              <a href="https://sea-orm-pro-demo.sea-ql.org/admin/" target="_blank" class="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-gray-900 px-6 py-3.5 text-center font-semibold text-white transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300/50 sm:w-auto sm:px-8 hover-btn">
                Try the Demo
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="flex w-full justify-end">
        <div class="relative overflow-hidden pl-8 md:w-2/5 md:pl-0 xl:w-1/2 xl:pl-16" x-data="{ modalIsOpen: false }">
          <div class="relative">
            <img class="hidden max-w-none rounded-xl border-2 border-gray-200 md:block dark:md:hidden" width="1008" src="img/01_banner.png" />
            <img class="max-w-none rounded-xl border-2 border-gray-200 dark:hidden md:hidden" width="720" src="img/01_banner.png" />
            <img class="hidden max-w-none rounded-xl border-2 border-transparent dark:hidden dark:md:block" width="1008" src="img/01_banner_dark.png" />
            <img class="hidden max-w-none rounded-xl border-2 border-transparent dark:block dark:md:hidden" width="720" src="img/01_banner_dark.png" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageSlogan() {
  return (
    <section class="relative py-24 lg:py-32">
      <div class="absolute inset-0 flex flex-col">
        <div class="mt-auto h-1/2 w-full bg-[#EAF4FC] dark:bg-[#15263c]"></div>
      </div>
      <div class="mx-auto w-full max-w-2xl px-8 lg:max-w-7xl">
        <div class="relative grid items-center gap-12 overflow-hidden rounded-xl bg-gray-800 bg-[url()] bg-[length:640px] bg-right-bottom bg-no-repeat px-8 py-12 dark:bg-gray-900 md:p-20 lg:grid-cols-2">
          <div class="relative">
            <IoIosFlash color="#0d9ef1" size="64" />
            <h2 class="mt-6 text-3xl font-semibold text-white sm:text-4xl md:text-5xl/tight xl:text-6xl/tight">
              Launch Admin Panel in minutes.
            </h2>
            <p class="mt-6 font-medium text-gray-400 sm:text-lg">
              Use SeaORM Pro with any Rust web framework, simply follow the 3 easy steps to setup an admin panel for existing SeaORM projects.
            </p>
            <p class="mt-4 font-medium text-gray-400 sm:text-lg">
              Or even better, build your next application with our fullstack webapp template!
            </p>
          </div>

          <div class="relative">
            <div class="aspect-[4/5] w-[240px] rounded-xl bg-gray-900 dark:border-gray-900 dark:bg-gray-800 sm:w-[320px] overflow-hidden">
              <img class="dark:hidden object-cover" src="img/02_login.png" />
              <img class="hidden dark:block object-cover" src="img/02_login.png" />
            </div>
            <div class="absolute right-0 top-56 aspect-[320/179] w-[240px] rounded-xl bg-gray-900 dark:border-gray-900 dark:bg-gray-800 sm:top-64 sm:w-[320px] md:-right-8 lg:top-64 overflow-hidden">
              <img class="dark:hidden object-cover" src="img/03_filter.png" />
              <img class="hidden dark:block object-cover" src="img/03_filter_dark.png" />
            </div>
            <div class="relative ml-4 mt-12 aspect-[240/180] w-[320px] rounded-xl bg-gray-900 dark:border-gray-900 dark:bg-gray-800 sm:ml-12 sm:w-[340px] md:ml-24 overflow-hidden">
              <img class="dark:hidden object-cover" src="img/04_table.png" />
              <img class="hidden dark:block object-cover" src="img/04_table_dark.png" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageFeatures() {
  return (
    <section class="bg-gradient-to-b from-[#EAF4FC] to-transparent dark:from-[#15263c]">
      <div class="mx-auto w-full max-w-2xl px-8 lg:max-w-7xl">
        <div class="text-center">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white md:text-5xl/tight lg:text-6xl/tight">
            Out-of-the-box features
          </h2>
          <p class="mx-auto mt-6 max-w-2xl text-gray-600 dark:text-gray-400 sm:text-lg">
            SeaORM Pro takes the hassle out of crafting beautiful backend admin panels.
          </p>
        </div>
        <div class="mt-12 grid gap-8 lg:grid-cols-2">
          <div class="relative flex flex-col items-center rounded-xl border border-gray-400/30 px-10 pt-10 text-center dark:border-gray-600/20 lg:flex-row lg:gap-6 lg:px-0 lg:py-16 lg:text-left lg:col-span-2 bg-white dark:bg-gray-900">
            <div class="absolute inset-0 dark:opacity-20 sm:bg-[url()] sm:bg-right-top sm:bg-no-repeat md:bg-[length:480px]"></div>
            <div class="relative lg:p-10 lg:pl-20">
              <div class="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-800 bg-gray-800 shadow-lg sm:h-20 sm:w-20">
                <FiDatabase color="#0d9ef1" size="38" />
              </div>
              <h3 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white sm:mt-6 sm:text-4xl xl:text-[40px]">
                Full CRUD
              </h3>
              <p class="mt-4 max-w-xl text-gray-700 dark:text-gray-400 sm:mt-6 lg:text-lg">
                SeaORM Pro provides a full CRUD interface for your SeaORM models.
              </p>
            </div>
            <div class="relative flex w-full flex-1 items-end pt-12 lg:block lg:!w-[60%] lg:flex-auto lg:shrink-0 lg:pt-0">
              <div class="h-[290px] w-full rounded-t-xl border-l border-r border-t border-gray-400/30 bg-gray-50 dark:border-gray-600/20 flex overflow-hidden lg:h-[616px] lg:rounded-l-xl lg:rounded-tr-none lg:border-b lg:border-r-0 bg-gray-100 dark:bg-gray-800">
                <img class="dark:hidden object-cover object-top lg:object-left w-full" src="img/05_table_crud.png" />
                <img class="hidden dark:block object-cover object-top lg:object-left w-full" src="img/05_table_crud_dark.png" />
              </div>
            </div>
          </div>
          <div class="relative flex flex-col items-center rounded-xl border border-gray-400/30 px-10 pt-10 text-center dark:border-gray-600/20 bg-white dark:bg-gray-900">
            <div class="absolute inset-0 dark:opacity-20"></div>
            <div class="relative">
              <div class="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-800 bg-gray-800 shadow-lg sm:h-20 sm:w-20">
                <FaReact color="#0d9ef1" size="38" />
              </div>
              <h3 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white sm:mt-6 sm:text-4xl xl:text-[40px]">
                Built on industry standard React + GraphQL
              </h3>
              <p class="mt-4 max-w-xl text-gray-700 dark:text-gray-400 sm:mt-6 lg:text-lg">
                Build professional, sleek user interface with Ant Design Pro, a feature-rich React component library + framework for building enterprise applications. Use SeaORM Pro as the foundation to bring your vision to life!
              </p>
            </div>
            <div class="relative flex w-full flex-1 items-end pt-12">
              <div class="h-[240px] w-full rounded-t-xl border-l border-r border-t border-gray-400/30 bg-gray-50 dark:border-gray-600/20 flex overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img class="dark:hidden object-cover object-top w-full" src="img/01_banner.png" />
                <img class="hidden dark:block object-cover object-top w-full" src="img/01_banner_dark.png" />
              </div>
            </div>
          </div>
          <div class="relative flex flex-col items-center rounded-xl border border-gray-400/30 px-10 pt-10 text-center dark:border-gray-600/20 bg-gray-100 dark:bg-gray-900">
            <div class="absolute inset-0 dark:opacity-20 bg-[url()] bg-[length:94%] bg-bottom bg-no-repeat"></div>
            <div class="relative">
              <div class="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-800 bg-gray-800 shadow-lg sm:h-20 sm:w-20">
                <GrGraphQl color="#0d9ef1" size="38" />
              </div>
              <h3 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white sm:mt-6 sm:text-4xl xl:text-[40px]">
                GraphQL resolver? Built-in
              </h3>
              <p class="mt-4 max-w-xl text-gray-700 dark:text-gray-400 sm:mt-6 lg:text-lg">
                Gone are the days of building GraphQL resolvers by hand! With Seaography, your SeaORM schema is automagically transformed into a fully-functional GraphQL schema, enabling you to write, sort, filter, and join GraphQL queries on the frontend.
              </p>
            </div>
            <div class="relative flex w-full flex-1 items-end pt-12">
              <div class="h-[240px] w-full rounded-t-xl border-l border-r border-t border-gray-400/30 bg-gray-50 dark:border-gray-600/20 flex overflow-hidden bg-white dark:bg-gray-800">
                <img class="dark:hidden object-cover object-top w-full" src="img/06_graphql_api.png" />
                <img class="hidden dark:block object-cover object-top w-full" src="img/06_graphql_api.png" />
              </div>
            </div>
          </div>
          <div class="relative flex flex-col items-center rounded-xl border border-gray-400/30 px-10 pt-10 text-center dark:border-gray-600/20 lg:flex-row lg:gap-6 lg:px-0 lg:py-16 lg:text-left lg:col-span-2 bg-white dark:bg-gray-900">
            <div class="absolute inset-0 dark:opacity-20 sm:bg-[url()] sm:bg-right-top sm:bg-no-repeat md:bg-[length:480px]"></div>
            <div class="relative lg:p-10 lg:pl-20">
              <div class="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-800 bg-gray-800 shadow-lg sm:h-20 sm:w-20">
                <MdBackupTable color="#0d9ef1" size="38" />
              </div>
              <h3 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white sm:mt-6 sm:text-4xl xl:text-[40px]">
                Dark Mode? Sure!
              </h3>
              <p class="mt-4 max-w-xl text-gray-700 dark:text-gray-400 sm:mt-6 lg:text-lg">
                Customize the UI theme easily with light / dark mode support.
              </p>
            </div>
            <div class="relative flex w-full flex-1 items-end pt-12 lg:block lg:!w-[60%] lg:flex-auto lg:shrink-0 lg:pt-0">
              <div class="h-[240px] w-full rounded-t-xl border-l border-r border-t border-gray-400/30 bg-gray-50 dark:border-gray-600/20 flex overflow-hidden lg:h-[616px] lg:rounded-l-xl lg:rounded-tr-none lg:border-b lg:border-r-0 bg-gray-100 dark:bg-gray-800">
                <img class="dark:hidden object-cover object-top lg:object-left w-full" src="img/07_dark_mode.png" />
                <img class="hidden dark:block object-cover object-top lg:object-left w-full" src="img/07_dark_mode.png" />
              </div>
            </div>
          </div>
          <div class="relative flex flex-col items-center rounded-xl border border-gray-400/30 px-10 pt-10 text-center dark:border-gray-600/20 lg:col-span-2 lg:pt-20 bg-white dark:bg-gray-900">
            <div class="absolute inset-0 dark:opacity-20 sm:bg-[url()] sm:bg-left-bottom sm:bg-no-repeat md:bg-[length:480px]"></div>
            <div class="relative">
              <div class="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-800 bg-gray-800 shadow-lg sm:h-20 sm:w-20">
                <MdCode color="#0d9ef1" size="38" />
              </div>
              <h3 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white sm:mt-6 sm:text-4xl xl:text-[40px]">
                (Almost) Low Code
              </h3>
              <p class="mt-4 max-w-xl text-gray-700 dark:text-gray-400 sm:mt-6 lg:text-lg">
                Customize the UI easily with a simple, elegant toml syntax.
                <br/>
                Absolutely no generated code bloat.
              </p>
            </div>
            <div class="relative flex w-full flex-1 items-end pt-12">
              <div class="h-[240px] w-full rounded-t-xl border-l border-r border-t border-gray-400/30 bg-gray-50 dark:border-gray-600/20 flex overflow-hidden lg:mx-auto lg:h-[600px] lg:w-[85%] bg-gray-100 dark:bg-gray-800">
                <img class="dark:hidden object-cover object-top lg:object-left w-full" src="img/08_low_code.png" />
                <img class="hidden dark:block object-cover object-top lg:object-left w-full" src="img/08_low_code_dark.png" />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-12 rounded-xl border border-gray-400/30 bg-gray-100 p-12 text-center dark:border-gray-600/20 dark:bg-gray-900 sm:mt-12 sm:p-20 lg:mt-16 xl:p-24">
          <h3 class="text-4xl font-semibold text-gray-900 dark:text-white lg:text-5xl">
            Start Building Today
          </h3>
          <div class="mt-8 flex flex-col gap-4 justify-center sm:flex-row sm:gap-6">
            <a href="docs/install-and-config/getting-started-loco/" class="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-gradient-to-br from-green-300 to-blue-green-300 px-6 py-3.5 text-center font-semibold text-gray-900 transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300/50 sm:w-auto sm:px-8 request-license-btn hover-btn">
              Getting Started
            </a>
            <a href="https://sea-orm-pro-demo.sea-ql.org/admin/" target="_blank" class="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-gray-900 px-6 py-3.5 text-center font-semibold text-white transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300/50 sm:w-auto sm:px-8 hover-btn">
              Try the Demo
            </a>
          </div>
          <div class="mt-8 flex flex-col flex-wrap items-center sm:items-baseline gap-6 justify-center sm:flex-row lg:gap-x-16">
            <img class="dark-mode object-cover h-[80px] lg:h-[120px]" src="img/databases/MariaDB.svg" />
            <img class="dark-mode object-cover h-[60px] lg:h-[100px]" src="img/databases/MySQL.svg" />
            <img class="dark-mode object-cover h-[80px] lg:h-[100px]" src="img/databases/SQLite.svg" />
            <img class="dark-mode object-cover h-[70px] lg:h-[100px]" src="img/databases/PostgreSQL.svg" />
            <img class="dark-mode object-cover h-[90px] lg:h-[140px]" src="img/databases/MSSQL.svg" />
          </div>
          <div class="mt-6">
            *SQL Server support via <a href="https://www.sea-ql.org/SeaORM-X/" target="_blank">SeaORM X</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      description={siteConfig.tagline}>
      <HomepageHeader />
      <HomepageSlogan />
      <HomepageFeatures />
      <HomepageMascot />
      {/* <main> */}
      {/* <HomepageFeatures /> */}
      {/* <HomepageExample /> */}
      {/* <HomepageCompare /> */}
      {/* <HomepageProducts /> */}
      {/* <HomepageSponsors /> */}
      {/* <HomepageWaitingList /> */}
      {/* <HomepageMascot /> */}
      {/* </main> */}
    </Layout>
  );
}
