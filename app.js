import { writeFile } from 'fs'
import { Client } from 'ssh2'
import prompt from 'prompt'

prompt.start();

const sshConn = new Client();

var schema = {
    properties: {
        // username: {
        //     pattern: /^[a-zA-Z\s\-]+$/,
        //     message: 'Name must be only letters, spaces, or dashes',
        //     required: true
        // },
        password: {
            hidden: true
        },
        // host: {
        //     required: true
        // },
        // port: {
        //     required: true
        // },
        //     fileName: {
        //         required: true
        //     }
    }
};

prompt.get(schema, (error, result) => {
    if (error) throw error

    const { password } = result
    const username = 'Ivan'
    const port = 22

    const host = '172.30.10.254'
    
    sshConn.connect({
        host,
        port,
        username,
        password
    })
    
    const cmds = [
        'config global \n',
        'show system ha \n',
        'get system ha status \n',
    ];

    sshConn.on('ready', () => {
        console.log('Client :: ready');
        sshConn.shell((err, stream) => {
            stream.on('close', (code) => {
                // test


                if (output.includes('Saved Games')) {
                    console.log(output.includes('Saved Games'));
                  }
                  //test end
                //console.log('stream :: close\n', { code });
            })

            stream.on('data', (myData) => {
                console.log('stream :: data\n', myData.toString());
                writeFile('config_global.txt', myData, { flag: 'a+' }, err => { })
            })

            stream.on('exit', (code) => {
                console.log('stream :: exit\n', { code });
                sshConn.end();
            })

            stream.on('error', (e) => {
                console.log('stream :: error\n', { e });
                rej(e);
            });
            
            for (let i = 0; i < cmds.length; i += 1) {
                const cmd = cmds[i];
                stream.write(`${cmd}`);
            }
        })
    })
})