import { rest } from 'msw';

export const handlers = [
    rest.post('/auth/login', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                access_token: "test"
            })
        )
    }),
    rest.get('/auth/registerState', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                isOpen: false
            })
        )
    }),
    rest.get('/process/tree', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                "pid": 0,
                "ppid": -1,
                "cpu": 0,
                "mem": 0,
                "sum_cpu": 295.79999999999995,
                "sum_mem": 39.700000000000003,
                "children": [
                    {
                        "pid": 1,
                        "ppid": 0,
                        "cpu": 0.1,
                        "mem": 0,
                        "sum_cpu": 195.29999999999995,
                        "sum_mem": 19.700000000000003,
                        "children": [],
                        "user": "root",
                        "command": "/sbin/init splash"
                    },
                    {
                        "pid": 1034,
                        "ppid": 0,
                        "cpu": 0.1,
                        "mem": 0,
                        "sum_cpu": 100,
                        "sum_mem": 20,
                        "children": [],
                        "user": "root",
                        "command": "/sbin/init splash"
                    }
                ],
                "user": "",
                "command": ""
            })
        )
    }),
    rest.get('net-traffic', (req, res, ctx) => {
        const sent = Math.random() * 100;
        const received = Math.random() * 100;
        return res(
            ctx.status(200),
            ctx.json([
                {
                    "name": "main.js",
                    "program": "node /home/struggle/struggle_yt/project/chocoberry/dist/main.js",
                    "pid": "489160",
                    "uid": "0",
                    "user": "root",
                    "sent": sent.toString(),
                    "received": received.toString()
                }
            ])
        )
    }),
    rest.get('gpu/summary', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                "cuda_version": "12.1",
                "gpus": [
                    {
                        "name": "NVIDIA GeForce RTX 2080 Ti",
                        "memUsed": 744,
                        "memTotal": 11264,
                        "utilization": 0,
                        "processes": [
                            {
                                "pid": 1034,
                                "ppid": 0,
                                "uid": 1005,
                                "gid": 1007,
                                "name": "python3.10",
                                "bin": "/home/xyqlx/anaconda3/envs/xyqlx-yolov8/bin/python3.10",
                                "cmd": "/home/xyqlx/anaconda3/envs/xyqlx-yolov8/bin/python3.10 /home/xyqlx/anaconda3/envs/yt-yolov8/bin/yolo detect predict model=yolov8m.pt source=./source conf=0.01 save_crop",
                                "user": "xyqlx",
                                "cwd": "/home/xyqlx/project/yolov8",
                                "starttime": "Mon Oct 16 16:45:14 2023",
                                "usedmemory": "744"
                            }
                        ]
                    },
                    {
                        "name": "NVIDIA GeForce RTX 2080 Ti",
                        "memUsed": 1,
                        "memTotal": 11264,
                        "utilization": 0,
                        "processes": []
                    },
                    {
                        "name": "NVIDIA GeForce RTX 2080 Ti",
                        "memUsed": 1,
                        "memTotal": 11264,
                        "utilization": 0,
                        "processes": []
                    },
                    {
                        "name": "NVIDIA GeForce RTX 2080 Ti",
                        "memUsed": 1,
                        "memTotal": 11264,
                        "utilization": 0,
                        "processes": []
                    }
                ]
            })
        )
    }),
    rest.get('cpu', (req, res, ctx) => {
        const percent = Math.random() * 10 + 5;
        return res(
            ctx.status(200),
            ctx.json({
                "percent": percent,
                "seconds": 1.018892097,
                "logicCores": 24
            })
        )
    }),
    rest.get('memory', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                "free": 42.25251007080078,
                "total": 62.676761627197266
            })
        )
    }),
    rest.get('tasks/log/performance', (req, res, ctx) => {
        // get days and sampleInterval from query
        const days = req.url.searchParams.get('days');
        const sampleInterval = req.url.searchParams.get('sampleInterval');
        if(!days || !sampleInterval){
            return res(
                ctx.status(400),
                ctx.json({
                    "message": "days and sampleInterval must be provided"
                })
            )
        }
        // generate data
        const data = [];
        // from days ago to now
        const samples = 24 * 60 * parseInt(days) / parseInt(sampleInterval);
        const now = new Date();
        let cpuPercent = 10;
        let memFree = 50;
        for(let i = 0; i < samples; i++){
            cpuPercent += Math.random() * 1 - 0.5;
            if(cpuPercent < 0){
                cpuPercent = 0;
            }
            if(cpuPercent > 100){
                cpuPercent = 100;
            }
            const time = new Date(now.getTime() - i * parseInt(sampleInterval) * 60 * 1000);
            data.push(
                {
                    "version": 1,
                    "time": time.toISOString(),
                    "cpu": {
                        "percent": cpuPercent,
                        "seconds": 1.022922012,
                        "logicCores": 24
                    },
                    "mem": {
                        "free": memFree,
                        "total": 62.676761627197266
                    },
                    "gpu": {
                        "cuda_version": "12.1",
                        "gpus": [
                            {
                                "name": "NVIDIA GeForce RTX 2080 Ti",
                                "memUsed": 1,
                                "memTotal": 11264,
                                "utilization": 20,
                                "processes": [
                                    {
                                        "pid": 1034,
                                        "ppid": 0,
                                        "uid": 1005,
                                        "gid": 1007,
                                        "name": "python3.10",
                                        "bin": "/home/xyqlx/anaconda3/envs/xyqlx-yolov8/bin/python3.10",
                                        "cmd": "/home/xyqlx/anaconda3/envs/xyqlx-yolov8/bin/python3.10 /home/xyqlx/anaconda3/envs/yt-yolov8/bin/yolo detect predict model=yolov8m.pt source=./source conf=0.01 save_crop",
                                        "user": "xyqlx",
                                        "cwd": "/home/xyqlx/project/yolov8",
                                        "starttime": "Mon Oct 16 16:45:14 2023",
                                        "usedmemory": "744"
                                    }
                                ]
                            },
                            {
                                "name": "NVIDIA GeForce RTX 2080 Ti",
                                "memUsed": 1,
                                "memTotal": 11264,
                                "utilization": 0,
                                "processes": []
                            },
                            {
                                "name": "NVIDIA GeForce RTX 2080 Ti",
                                "memUsed": 1,
                                "memTotal": 11264,
                                "utilization": 0,
                                "processes": []
                            },
                            {
                                "name": "NVIDIA GeForce RTX 2080 Ti",
                                "memUsed": 1,
                                "memTotal": 11264,
                                "utilization": 0,
                                "processes": []
                            }
                        ]
                    }
                }
            )
        }
        data.reverse();
        return res(
            ctx.status(200),
            ctx.json(data)
        );
    }),
    rest.get('notify', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    "userId": "test",
                    "type": "gpu",
                    "repeat": 1,
                    "payload": {},
                    "notifyType": "notify",
                    "created": 1697447197017
                },
                {
                    "userId": "test",
                    "type": "process",
                    "repeat": 1,
                    "payload": {
                        "processId": 1034
                    },
                    "notifyType": "notify",
                    "created": 1697447381667
                }
            ])
        )
    }),
    rest.get('auth/userinfo', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                "name": "chocoberry",
                "linuxUser": "xyqlx",
                "email": "mxxyqlx@qq.com"
            })
        )
    }),
    rest.get('auth/permissions', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                "control_register_state"
            ])
        )
    }),
];