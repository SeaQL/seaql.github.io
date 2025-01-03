import React, { useEffect } from "react";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartDeferred from 'chartjs-plugin-deferred';
import Chart from 'chart.js/auto'

async function pieChart(id, data) {
    new Chart(
        document.getElementById(id),
        {
            type: 'pie',
            data: {
                labels: data.map(row => row.label),
                datasets: [{
                    data: data.map(row => row.count)
                }]
            },
            plugins: [ChartDeferred, ChartDataLabels],
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "left",
                    },
                    datalabels: {
                        formatter: function(value, ctx) {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map(data => {
                                sum += data;
                            });
                            const percent = (value * 100 / sum).toFixed(0);
                            if (percent <= 2) {
                                return null;
                            }
                            return percent + "%";
                        },
                        font: {
                            weight: "800"
                        },
                        color: "rgb(28, 30, 33)",
                    },
                },
                aspectRatio: 2.5,
            }
        }
    );
}

async function barChart(id, data, indexAxis='y') {
    new Chart(
        document.getElementById(id),
        {
            type: 'bar',
            data: {
                labels: data.map(row => row.label),
                datasets: [{
                    data: data.map(row => row.count)
                }]
            },
            plugins: [ChartDeferred, ChartDataLabels],
            options: {
                responsive: true,
                indexAxis,
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        formatter: function(value, ctx) {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map(data => {
                                sum += data;
                            });
                            const percent = (value * 100 / sum).toFixed(0);
                            if (percent <= 1) {
                                return null;
                            }
                            return percent + "%";
                        },
                        font: {
                            weight: "800"
                        },
                        color: "rgb(28, 30, 33)",
                    },
                },
            },
        }
    );
}

export function badges(props) {
    return (
        props.items.map((item) => {
            return (
                <span class="badge badge--secondary badge-dark-mode" style={{ marginRight: "6px", marginBottom: "6px" }}>{ item }</span>
            )
        })
    )
}

export function Canvas(props) {
    return (
        <div style={{ marginBottom: "60px" }}>
            <canvas id={props.id} class="chart-js" style={{ width: "100%", margin: "auto auto", marginBottom: "10px" }}></canvas>
            {props.children}
        </div>
    )
}

export function country(props) {
    const id = "country";
    const data = [
        { label: "China", count: 114 },
        { label: "USA", count: 103 },
        { label: "Germany", count: 91 },
        { label: "India", count: 34 },
        { label: "United Kingdom", count: 30 },
        { label: "Taiwan", count: 19 },
        { label: "Australia", count: 19 },
        { label: "France", count: 19 },
        { label: "Switzerland", count: 15 },
        { label: "Canada", count: 15 },
        { label: "Belgium", count: 15 },
        { label: "Vietnam", count: 15 },
        { label: "Brazil", count: 11 },
        { label: "Hong Kong", count: 11 },
        { label: "Indonesia", count: 11 },
        { label: "Netherlands", count: 11 },
        { label: "Russia", count: 11 },
        { label: "Mexico", count: 8 },
        { label: "Portugal", count: 8 },
        { label: "South Korea", count: 8 },
        { label: "Hungary", count: 8 },
        { label: "Iran", count: 8 },
        { label: "Other", count: 100 },
    ];
    useEffect(() => {
        barChart(id, data, 'x')
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function codingYears(props) {
    const id = "codingYears";
    const data = [
        { label: "Less than 1 year", count: 4 },
        { label: "1 to 4 years", count: 118 },
        { label: "5 to 9 years", count: 270 },
        { label: "10 to 14 years", count: 133 },
        { label: "15 to 19 years", count: 61 },
        { label: "20 to 24 years", count: 42 },
        { label: "25 to 29 years", count: 34 },
        { label: "30 to 34 years", count: 15 },
        { label: "35 to 39 years", count: 8 },
        { label: "40 to 44 years", count: 8 },
        { label: "More than 50 years", count: 4 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function jobTitle(props) {
    const id = "jobTitle";
    const data = [
        { label: "Developer, full-stack", count: 224 },
        { label: "Developer, back-end", count: 186 },
        { label: "Student", count: 95 },
        { label: "Research & Development role", count: 19 },
        { label: "Developer, desktop or enterprise applications", count: 15 },
        { label: "Engineering manager", count: 11 },
        { label: "Cloud infrastructure engineer", count: 11 },
        { label: "Senior Executive (C-Suite, VP, etc.)", count: 11 },
        { label: "Developer, front-end", count: 11 },
        { label: "Blockchain Engineer", count: 11 },
        { label: "Developer, embedded applications or devices", count: 11 },
        { label: "DevOps specialist", count: 11 },
        { label: "Security professional", count: 8 },
        { label: "Engineer, site reliability", count: 8 },
        { label: "System administrator", count: 8 },
        { label: "Data scientist or machine learning specialist", count: 8 },
        { label: "Other", count: 40 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function seaqlYears(props) {
    const id = "seaqlYears";
    const data = [
        { label: "Less than 1 month", count: 327 },
        { label: "Less than 2 months", count: 72 },
        { label: "Less than 3 months", count: 61 },
        { label: "Less than 6 months", count: 87 },
        { label: "1 year", count: 106 },
        { label: "2 years", count: 38 },
        { label: "3 years", count: 4 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function seaqlLibs(props) {
    const id = "seaqlLibs";
    const data = [
        { label: "SeaORM", count: 688 },
        { label: "SeaQuery", count: 277 },
        { label: "SeaSchema", count: 80 },
        { label: "Seaography", count: 27 },
        { label: "FireDBG", count: 19 },
        { label: "SeaStreamer", count: 11 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function seaqlLibContext(props) {
    const id = "seaqlLibContext";
    const data = [
        { label: "Personal (Hobby)", count: 441 },
        { label: "Professional (Work)", count: 236 },
        { label: "Academic (School)", count: 19 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function numTeamMembers(props) {
    const id = "numTeamMembers";
    const data = [
        { label: "1", count: 448 },
        { label: "2-5", count: 213 },
        { label: "6-10", count: 27 },
        { label: "11-25", count: 4 },
        { label: "26-50", count: 0 },
        { label: "51-100", count: 0 },
        { label: "101+", count: 4 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function projNature(props) {
    const id = "projNature";
    const data = [
        { label: "Server for a website", count: 274 },
        { label: "A micro-service in a complex system", count: 99 },
        { label: "Enterprise information system", count: 68 },
        { label: "Content management system", count: 49 },
        { label: "Backend of a mobile application", count: 49 },
        { label: "Research project", count: 42 },
        { label: "Desktop application", count: 34 },
        { label: "Backend for a game", count: 19 },
        { label: "E-commerce", count: 19 },
        { label: "Other", count: 44 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function devEnv(props) {
    const id = "devEnv";
    const data = [
        { label: "Linux", count: 570 },
        { label: "Windows", count: 330 },
        { label: "macOS", count: 239 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function devEnvLinux(props) {
    const id = "devEnvLinux";
    const data = [
        { label: "Ubuntu", count: 217 },
        { label: "Arch", count: 156 },
        { label: "Debian", count: 72 },
        { label: "Fedora", count: 68 },
        { label: "NixOS", count: 38 },
        { label: "Pop!_OS", count: 11 },
        { label: "OpenSUSE", count: 8 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function devEnvWindows(props) {
    const id = "devEnvWindows";
    const data = [
        { label: "Windows Native", count: 205 },
        { label: "Windows Subsystem for Linux", count: 125 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function devEnvMac(props) {
    const id = "devEnvMac";
    const data = [
        { label: "macOS (Apple Silicon: M1, M2, etc.)", count: 190 },
        { label: "macOS (Intel)", count: 49 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function databases(props) {
    const id = "databases";
    const data = [
        { label: "Postgres", count: 528 },
        { label: "SQLite", count: 258 },
        { label: "MySQL", count: 148 },
        { label: "DuckDB", count: 8 },
        { label: "Other", count: 40 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function webFrameworks(props) {
    const id = "webFrameworks";
    const data = [
        { label: "Axum", count: 414 },
        { label: "Actix", count: 95 },
        { label: "Rocket", count: 53 },
        { label: "Not Using Any Web Framework", count: 23 },
        { label: "Salvo", count: 19 },
        { label: "Poem", count: 15 },
        { label: "Loco.rs", count: 11 },
        { label: "Other", count: 24 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function deploymentEnv(props) {
    const id = "deploymentEnv";
    const data = [
        { label: "Desktop distribution", count: 91 },
        { label: "AWS EC2", count: 80 },
        { label: "Alibaba Cloud", count: 57 },
        { label: "DigitalOcean Droplet", count: 57 },
        { label: "Google Cloud Platform", count: 30 },
        { label: "Serverless (e.g. AWS Lambda)", count: 23 },
        { label: "Bare Metal Server", count: 19 },
        { label: "Hetzner", count: 19 },
        { label: "Azure", count: 15 },
        { label: "AWS ECS", count: 11 },
        { label: "Heroku", count: 11 },
        { label: "Other", count: 20 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function usingRustForWork(props) {
    const id = "usingRustForWork";
    const data = [
        { label: "Yes", count: 342 },
        { label: "No", count: 353 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function industry(props) {
    const id = "industry";
    const data = [
        { label: "Software", count: 122 },
        { label: "Cloud Services", count: 27 },
        { label: "Education", count: 19 },
        { label: "Professional", count: 19 },
        { label: "Manufacturing", count: 15 },
        { label: "Non-profit", count: 15 },
        { label: "Finance/Insurance", count: 15 },
        { label: "Retail/Wholesale", count: 15 },
        { label: "Consulting", count: 11 },
        { label: "ISP/Telecom", count: 11 },
        { label: "Healthcare", count: 11 },
        { label: "Government", count: 11 },
        { label: "Utilities", count: 11 },
        { label: "Other", count: 32 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function numEngineers(props) {
    const id = "numEngineers";
    const data = [
        { label: "0", count: 34 },
        { label: "1", count: 125 },
        { label: "2-5", count: 129 },
        { label: "6-10", count: 11 },
        { label: "11-25", count: 4 },
        { label: "26-50", count: 8 },
        { label: "51-100", count: 8 },
        { label: "101-200", count: 8 },
        { label: "201-300", count: 8 },
        { label: "301-400", count: 0 },
        { label: "401-500", count: 0 },
        { label: "501-600", count: 0 },
        { label: "601-700", count: 4 },
        { label: "701-800", count: 0 },
        { label: "801-900", count: 0 },
        { label: "901-1000", count: 0 },
        { label: "1000+", count: 4 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function companySize(props) {
    const id = "companySize";
    const data = [
        { label: "1-10", count: 148 },
        { label: "11-100", count: 99 },
        { label: "101-200", count: 27 },
        { label: "201-300", count: 15 },
        { label: "301-400", count: 0 },
        { label: "401-500", count: 4 },
        { label: "501-600", count: 11 },
        { label: "601-700", count: 0 },
        { label: "701-800", count: 0 },
        { label: "801-900", count: 0 },
        { label: "901-1000", count: 0 },
        { label: "1000+", count: 38 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function techStack(props) {
    const id = "techStack";
    const data = [
        { label: "Backend / internal web services", count: 331 },
        { label: "Development / build tools", count: 137 },
        { label: "Public-facing web services", count: 125 },
        { label: "System infrastructure", count: 118 },
        { label: "Frontend", count: 46 },
        { label: "Other", count: 8 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function otherDatabases(props) {
    const id = "otherDatabases";
    const data = [
        { label: "Not interested", count: 255 },
        { label: "Microsoft SQL Server", count: 30 },
        { label: "Oracle Database", count: 27 },
        { label: "SurrealDB", count: 11 },
        { label: "Apache Cassandra", count: 8 },
        { label: "Yugabyte", count: 4 },
        { label: "ClickHouse", count: 4 },
        { label: "PostGIS", count: 4 },
        { label: "EdgeDB", count: 4 },
        { label: "IBM Db2", count: 4 },
        { label: "TiDB", count: 4 },
        { label: "Apache Arrow Flight", count: 4 },
        { label: "MongoDB", count: 4 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function learningRust(props) {
    const id = "learningRust";
    const data = [
        { label: "Yes", count: 338 },
        { label: "No", count: 357 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function familiarLang(props) {
    const id = "familiarLang";
    const data = [
        { label: "Javascript", count: 205 },
        { label: "Python", count: 179 },
        { label: "Typescript", count: 171 },
        { label: "Java", count: 118 },
        { label: "C / C++", count: 91 },
        { label: "Go", count: 61 },
        { label: "C#", count: 61 },
        { label: "Kotlin", count: 30 },
        { label: "PHP", count: 19 },
        { label: "scala", count: 15 },
        { label: "Dart", count: 11 },
        { label: "Swift", count: 8 },
        { label: "Ruby", count: 8 },
        { label: "Other", count: 24 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function rustDifficulty(props) {
    const id = "rustDifficulty";
    const data = [
        { label: "Okay: concepts are difficult to grasp, but manageable", count: 71 },
        { label: "Hard: I struggle in getting Rust code to compile", count: 6 },
        { label: "Easy: I feel right at home", count: 12 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function rustMotivation(props) {
    const id = "rustMotivation";
    const data = [
        { label: "The joy of programming", count: 289 },
        { label: "Rust is popular", count: 152 },
        { label: "Career advancement", count: 129 },
        { label: "Minimal footprint / performance", count: 23 },
        { label: "Memory-safety", count: 8 },
        { label: "Other", count: 20 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function learningResources(props) {
    const id = "learningResources";
    const data = [
        { label: "Official documentation", count: 319 },
        { label: "Online tutorials / articles", count: 266 },
        { label: "GitHub projects", count: 266 },
        { label: "Books", count: 148 },
        { label: "ChatGPT", count: 4 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function firstRustProj(props) {
    const id = "firstRustProj";
    const data = [
        { label: "Website", count: 236 },
        { label: "Backend API", count: 23 },
        { label: "CLI", count: 19 },
        { label: "Chatbot", count: 15 },
        { label: "Game", count: 11 },
        { label: "Desktop App", count: 4 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function familiarSql(props) {
    const id = "familiarSql";
    const data = [
        { label: "Intermediate: some experience", count: 160 },
        { label: "Beginner: basic knowledge", count: 61 },
        { label: "Expert: savvy SQL user", count: 118 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function whySeaql(props) {
    const id = "whySeaql";
    const data = [
        { label: "Nice documentation", count: 414 },
        { label: "Easy to get started", count: 342 },
        { label: "A popular choice", count: 247 },
        { label: "Plentiful examples", count: 205 },
        { label: "Friendly community", count: 76 },
        { label: "Async support", count: 38 },
        { label: "Other", count: 12 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function whatAdvancement(props) {
    const id = "whatAdvancement";
    const data = [
        { label: "Greater Postgres feature coverage", count: 357 },
        { label: "NewSQL database support (e.g. TiDB, CockroachDB)", count: 152 },
        { label: "First-class GraphQL integration", count: 133 },
        { label: "Tighter SQLite integration", count: 110 },
        { label: "Event stream and SeaStreamer integration", count: 106 },
        { label: "Working with nested structures", count: 38 },
        { label: "Complex joins", count: 30 },
        { label: "Other", count: 28 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function whatTool(props) {
    const id = "whatTool";
    const data = [
        { label: "Schema management suite (like Flyway)", count: 262 },
        { label: "Data admin panel (like Django Admin)", count: 220 },
        { label: "Monitoring dashboard (like AppSignal)", count: 198 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}
