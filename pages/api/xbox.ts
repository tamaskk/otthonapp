import { NextApiRequest, NextApiResponse } from "next";
import { Client } from 'tplink-smarthome-api'

import xnox from 'homebridge-xbox-tv'

const client = new Client();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const plug = await client.getDevice({ host: '192.168.100.83' })
        await plug.setPowerState(true);

        // // Wait for 5 seconds
        // await new Promise(resolve => setTimeout(resolve, 5000));

        // await plug.setPowerState(false);

        res.status(200).json({ message: "Plug turned on successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

export default handler;