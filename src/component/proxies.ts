import axios from "axios";
import fs from "node:fs";

export async function GenerateProxies() {
    /*     try {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
                headers: {}
            };
    
            return axios.request(config)
                .then((response) => {
                    let proxies: Array<string> = response.data.split('\r\n')
                    return proxies.map((i) => { return i.replace('\r\n', "") })
                })
                .catch((error) => {
                    console.log(error);
                    throw new Error('Failed To get Proxies ...')
                });
    
        } catch (error) {
    
        } */
    return fs.readFileSync('proxies.txt').toString().split('\n')
}


/* GenerateProxies() */