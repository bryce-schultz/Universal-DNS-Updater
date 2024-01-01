// https://dynamicdns.park-your-domain.com/update?host=[prefix]&domain=[domain]&password=[ddns_password]&ip=[ip]
// https://[username]:[password]@domains.google.com/nic/update?hostname=[hostname]&myip=[ip]

function bodyLoad()
{
    loadDNSProviders();
    loadDNSRecords();
}