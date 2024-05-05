function unixTimeToString(unixTime) {
    const date = new Date(unixTime * 1000);
    //const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Europe/Paris' };
    const options = { hour: 'numeric', minute: 'numeric', timeZone: 'Europe/Paris' };
    return date.toLocaleDateString('fr-FR', options);
}

module.exports = { unixTimeToString };