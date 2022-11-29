async function getStats(id) {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto("https://vghl.myvirtualgaming.com/vghlleagues/vgnhl/standings");
    const table = await page.$("#league");
    const tableData = await table.evaluate(() => {
        let link;
        let linkData = {};
        const rows = document.querySelectorAll("tr");
        delete rows['0']

        for (const [key, value] of Object.entries(rows)) {
            const linkExists = value?.querySelector('td')?.querySelector('a')?.href;
            if (!linkExists) continue;
            if (linkExists !== null && linkExists.split('=')[1] === String(id)) {
                console.log(value)
                linkData.link = linkExists;
                linkDataEntries = value.innerText.split('\t');
                linkData.data = {
                    GP: linkDataEntries[0],
                    W: linkDataEntries[1],
                    L: linkDataEntries[2],
                    OTL: linkDataEntries[3],
                    PTS: linkDataEntries[4],
                    GF: linkDataEntries[5],
                    GA: linkDataEntries[6],
                    Diff: linkDataEntries[7],
                    Home: linkDataEntries[8],
                    Road: linkDataEntries[9],
                    Last_10: linkDataEntries[10],
                    Streak: linkDataEntries[11],
                    Last_Game: linkDataEntries[12],
                }

                break;
            }
        }

        return linkData;
        // return rows['1'].innerText.split('\t')
    });
    
    return tableData;
}

module.exports.plugin = {
    name: "VGHLL",
    description: "VGHLL Stats",
    author: 'Dan Perkins (Aesth3tical)',
    repository: 'https://github.com/Devetical/Modmail-Plugins/blob/main/statistics/plugin.js',
}

module.exports.stats = {
    name: "stats",
    description: "VGHLL Stats",
    usage: "{PREFIX}stats <team_id>",
    category: "utility",
    run: async ({ client, message, args }) => {
        if (!args[0]) return client.embeds.error({
            message: message,
            options: {
                error: `Invalid arguments provided. See \`\`${guildData.config.prefix}help stats\`\` for more information.`
            }
        });

        const id = args[0];
        const stats = await getStats(id);

        return client.embeds.success({
            message: message,
            options: {
                description: JSON.stringify(stats)
            }
        });
    }
}
