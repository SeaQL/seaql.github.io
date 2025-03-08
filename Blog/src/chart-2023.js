import React, { useEffect } from "react";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartDeferred from 'chartjs-plugin-deferred';
import Chart from 'chart.js/auto'

async function pieChart(id, data) {
    new Chart(
        document.getElementById('23'+id),
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

async function barChart(id, data) {
    new Chart(
        document.getElementById('23'+id),
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
                indexAxis: 'y',
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
            }
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
            <canvas id={'23'+props.id} class="chart-js" style={{ width: "100%", margin: "auto auto", marginBottom: "10px" }}></canvas>
            {props.children}
        </div>
    )
}

export function numUsingSeaQL(props) {
    const id = "numUsingSeaQL";
    const data = [
        { label: "Yes", count: 492 },
        { label: "No", count: 32 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function numUsingSeaQLLib(props) {
    const id = "numUsingSeaQLLib";
    const data = [
        { label: "SeaORM", count: 489 },
        { label: "SeaQuery", count: 227 },
        { label: "SeaSchema", count: 70 },
        { label: "Other", count: 10 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function numUsingContext(props) {
    const id = "numUsingContext";
    const data = [
        { label: "Personal (Hobby)", count: 297 },
        { label: "Professional (Work)", count: 188 },
        { label: "Academic (School)", count: 6 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function numCountry(props) {
    const id = "numCountry";
    const data = [
        { label: "Germany", count: 86 },
        { label: "United States of America", count: 76 },
        { label: "China", count: 35 },
        { label: "India", count: 19 },
        { label: "Canada", count: 12 },
        { label: "France", count: 12 },
        { label: "Russia", count: 12 },
        { label: "The Netherlands", count: 12 },
        { label: "Czech Republic", count: 12 },
        { label: "New Zealand", count: 9 },
        { label: "Switzerland", count: 9 },
        { label: "Brazil", count: 9 },
        { label: "United Kingdom", count: 9 },
        { label: "Other", count: 108 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function numTeamMember(props) {
    const id = "numTeamMember";
    const data = [
        { label: "1", count: 100 },
        { label: "2", count: 21 },
        { label: "3", count: 9 },
        { label: "4", count: 1 },
        { label: "5", count: 8 },
        { label: "6", count: 3 },
        { label: "8", count: 1 },
        { label: "10", count: 1 },
        { label: "11", count: 1 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function projNature(props) {
    const id = "projNature";
    const data = [
        { label: "Server for a website", count: 240 },
        { label: "A micro-service in a complex system", count: 64 },
        { label: "Backend of a mobile application", count: 48 },
        { label: "Desktop application", count: 28 },
        { label: "Enterprise information system", count: 22 },
        { label: "Backend for a game", count: 16 },
        { label: "Content management system", count: 16 },
        { label: "Research project", count: 12 },
        { label: "E-commerce", count: 12 },
        { label: "Other", count: 30 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function devEnv(props) {
    const id = "devEnv";
    const data = [
        { label: "Linux", count: 112+51+41+28+24 },
        { label: "Windows", count: 102+76 },
        { label: "MacOS", count: 160+16 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function devEnvLinux(props) {
    const id = "devEnvLinux";
    const data = [
        { label: "Ubuntu", count: 112 },
        { label: "Arch", count: 83 },
        { label: "Debian", count: 51 },
        { label: "Fedora", count: 41 },
        { label: "NixOS", count: 28 },
        { label: "Manjaro", count: 9 },
        { label: "openSUSE", count: 6 },
        { label: "RHEL", count: 3 },
        { label: "Mint", count: 3 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function devEnvWin(props) {
    const id = "devEnvWin";
    const data = [
        { label: "Windows (Native)", count: 102 },
        { label: "Windows Subsystem for Linux", count: 76 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function devEnvMac(props) {
    const id = "devEnvMac";
    const data = [
        { label: "MacOS (Apple Silicon) (M1, M2, etc)", count: 160 },
        { label: "MacOS (Intel)", count: 16 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function db(props) {
    const id = "db";
    const data = [
        { label: "Postgres", count: 348 },
        { label: "SQLite", count: 172 },
        { label: "MySQL", count: 105 },
        { label: "MariaDB", count: 6 },
        { label: "Other", count: 21 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function webFramework(props) {
    const id = "webFramework";
    const data = [
        { label: "Axum", count: 256 },
        { label: "Actix", count: 121 },
        { label: "Rocket", count: 38 },
        { label: "Poem", count: 16 },
        { label: "Tonic", count: 12 },
        { label: "Salvo", count: 6 },
        { label: "Other", count: 6 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function deployEnv(props) {
    const id = "deployEnv";
    const data = [
        { label: "Open-source containers (e.g. Docker)", count: 243 },
        { label: "Standalone machine or virtual machine", count: 166 },
        { label: "Desktop distribution", count: 35 },
        { label: "Serverless (e.g. AWS Lambda)", count: 12 },
        { label: "Proprietary cloud containers (e.g. AWS Lightsail)", count: 6 },
        { label: "Kubernetes", count: 6 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function useRust(props) {
    const id = "useRust";
    const data = [
        { label: "Yes", count: 252 },
        { label: "No", count: 272 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function industry(props) {
    const id = "industry";
    const data = [
        { label: "Consulting", count: 44 },
        { label: "Finance", count: 28 },
        { label: "Education", count: 19 },
        { label: "Automotive", count: 19 },
        { label: "Healthcare", count: 12 },
        { label: "Manufacturing", count: 9 },
        { label: "SaaS", count: 6 },
        { label: "Media", count: 5 },
        { label: "Other", count: 84 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function engineer(props) {
    const id = "engineer";
    const data = [
        { label: "1", count: 105 },
        { label: "2-4", count: 41+32+12 },
        { label: "5-9", count: 12+6+3+3 },
        { label: "10 or more", count: 9+9 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function companySize(props) {
    const id = "companySize";
    const data = [
        { label: "1-10", count: 121 },
        { label: "10-100", count: 76 },
        { label: "100-1000", count: 25 },
        { label: "1000+", count: 28 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function techStack(props) {
    const id = "techStack";
    const data = [
        { label: "Backend / internal web services", count: 230 },
        { label: "Development / build tools", count: 89 },
        { label: "Public-facing web services", count: 73 },
        { label: "System infrastructure", count: 70 },
        { label: "Frontend", count: 44 },
        { label: "Libraries", count: 3 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function numRustProj(props) {
    const id = "numRustProj";
    const data = [
        { label: "0", count: 15 },
        { label: "1", count: 42 },
        { label: "2", count: 11 },
        { label: "3", count: 3 },
        { label: "All", count: 3 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function dbInterested(props) {
    const id = "dbInterested";
    const data = [
        { label: "Not interested", count: 195 },
        { label: "Microsoft SQL Server", count: 25 },
        { label: "Google BigQuery", count: 22 },
        { label: "Oracle Database", count: 19 },
        { label: "Snowflake", count: 9 },
        { label: "IBM DB2", count: 3 },
        { label: "Salesforce", count: 3 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function learningRust(props) {
    const id = "learningRust";
    const data = [
        { label: "Yes", count: 291 },
        { label: "No", count: 233 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function familiarLanguage(props) {
    const id = "familiarLanguage";
    const data = [
        { label: "Javascript", count: 176 },
        { label: "Typescript", count: 160 },
        { label: "Python", count: 118 },
        { label: "Java", count: 108 },
        { label: "C / C++", count: 76 },
        { label: "C#", count: 67 },
        { label: "Go", count: 54 },
        { label: "PHP", count: 44 },
        { label: "Swift", count: 22 },
        { label: "Kotlin", count: 19 },
        { label: "Ruby", count: 12 },
        { label: "Other", count: 30 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function hardToLearn(props) {
    const id = "hardToLearn";
    const data = [
        { label: "Okay: concepts are difficult to grasp, but manageable", count: 220 },
        { label: "Easy: I feel right at home", count: 67 },
        { label: "Hard: I struggle in getting Rust code to compile", count: 3 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function motivation(props) {
    const id = "motivation";
    const data = [
        { label: "The joy of programming", count: 249 },
        { label: "Rust is popular", count: 131 },
        { label: "Career advancement", count: 102 },
        { label: "Other", count: 60 }
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function learningResource(props) {
    const id = "learningResource";
    const data = [
        { label: "Official documentation", count: 272 },
        { label: "Online tutorials / articles", count: 249 },
        { label: "GitHub projects", count: 201 },
        { label: "Books", count: 112 },
        { label: "Other", count: 27 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function firstProj(props) {
    const id = "firstProj";
    const data = [
        { label: "Website", count: 166 },
        { label: "CLI Tool", count: 34 },
        { label: "Game", count: 25 },
        { label: "Backend API", count: 19 },
        { label: "Other", count: 36 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function whySeaQL(props) {
    const id = "whySeaQL";
    const data = [
        { label: "Nice documentation", count: 67 },
        { label: "Easy to get started", count: 46 },
        { label: "A popular choice", count: 31 },
        { label: "Plentiful examples", count: 28 },
        { label: "Friendly community", count: 16 },
        { label: "Other", count: 60 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function familiarWithSql(props) {
    const id = "familiarWithSql";
    const data = [
        { label: "Intermediate: some experience", count: 182 },
        { label: "Expert: savvy SQL user", count: 64 },
        { label: "Beginner: basic knowledge", count: 44 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function quality(props) {
    const id = "quality";
    const data = [
        { label: "Async and runtime-dynamic", count: 416 },
        { label: "Comprehensive type system", count: 358 },
        { label: "High-level abstraction", count: 320 },
        { label: "Modular and non-monolithic", count: 224 },
        { label: "Other", count: 24 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function advancement(props) {
    const id = "advancement";
    const data = [
        { label: "Greater Postgres feature coverage", count: 300 },
        { label: "Tighter SQLite integration", count: 92 },
        { label: "First-class GraphQL integration", count: 89 },
        { label: "NewSQL database support (e.g. TiDB, CockroachDB)", count: 80 },
        { label: "Event stream and SeaStreamer integration", count: 67 },
        { label: "Other", count: 102 },
    ];
    useEffect(() => {
        barChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}

export function firstPartySupport(props) {
    const id = "firstPartySupport";
    const data = [
        { label: "Schema management suite (like Flyway)", count: 208 },
        { label: "Data admin panel (like Django Admin)", count: 182 },
        { label: "Monitoring dashboard (like AppSignal)", count: 169 },
        { label: "Other", count: 12 },
    ];
    useEffect(() => {
        pieChart(id, data)
    });
    return <Canvas id={id}>{props.children}</Canvas>
}
