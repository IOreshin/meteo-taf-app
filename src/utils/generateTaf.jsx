export function generateTaf(data) {
    const icao = data.city || "";
    const issue_time = data.issue_time || "";
    const time_from = data.time_from || "";
    const time_to = data.time_to || "";

    const wind_dir = parseInt(data.wind_dir || 0);
    const wind_speed = parseInt(data.wind_speed || 0);
    const visibility = parseInt(data.visibility || 0);

    const wind_gust = data.wind_gust !== "" && data.wind_gust !== undefined
        ? `G${data.wind_gust}`
        : "";

    const weather_events = data.weather_events 
        ? Object.values(data.weather_events)
        : [];
    const weather_str = weather_events.length > 0
        ? weather_events
        .map(c=> `${c.intensity}${c.descriptor}${c.weather_event || ""}`)
        .join(" ")
        : "NSW"

    const clouds_entries = data.clouds_entries
        ? Object.values(data.clouds_entries)
        : [];
    const clouds_str = clouds_entries.length > 0 
        ? clouds_entries
        .map(c => `${c.amount}${c.height}${c.cloud_type || ""}`)
        .join(" ") 
        : "";

    if (!data.group_type) {
        return (
            `TAF ${icao} ${issue_time}Z ` +
            `${time_from}/${time_to} ` +
            `${wind_dir.toString().padStart(3, "0")}` +
            `${wind_speed.toString().padStart(2, "0")}${wind_gust}MPS ` +
            `${visibility} ${weather_str}${clouds_str != "" ? " "+clouds_str : ""}`
        );
    }

    return (
        `${data.group_type} ${time_from}/${time_to} ` +
        `${wind_dir.toString().padStart(3, "0")}` +
        `${wind_speed.toString().padStart(2, "0")}${wind_gust}MPS ` +
        `${visibility} ${weather_str}${clouds_str != "" ? " "+clouds_str : ""}`
    );
}

export function generateTafAllGroups(inputData) {
    if (!inputData) return "";

    const keys = Object.keys(inputData)
        .map(k => parseInt(k))
        .sort((a, b) => a - b);

    let result = [];

    for (const key of keys) {
        const group = inputData[key];
        if (!group) continue;

        const tafLine = generateTaf(group);

        result.push(tafLine);
    }

    result[result.length - 1] = result[result.length - 1] + "=";
    return result.join("\n");
}