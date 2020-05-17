"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const versionMap = {
    12: {
        2: {
            0: {
                'windows-x64': 'https://get.enterprisedb.com/postgresql/postgresql-12.2-4-windows-x64-binaries.zip',
                darwin: 'https://get.enterprisedb.com/postgresql/postgresql-11.7-4-osx-binaries.zip',
                'darwin-x64': 'https://get.enterprisedb.com/postgresql/postgresql-11.7-4-osx-binaries.zip',
            },
        },
    },
    11: {
        7: {
            0: {
                'windows-x64': 'https://get.enterprisedb.com/postgresql/postgresql-11.7-4-windows-x64-binaries.zip',
                darwin: 'https://get.enterprisedb.com/postgresql/postgresql-11.7-3-osx-binaries.zip',
                'darwin-x64': 'https://get.enterprisedb.com/postgresql/postgresql-11.7-3-osx-binaries.zip',
            },
        },
    },
    10: {
        7: {
            0: {
                'linux-x86': 'https://get.enterprisedb.com/postgresql/postgresql-10.7-2-linux-binaries.tar.gz',
                'linux-x64': 'https://get.enterprisedb.com/postgresql/postgresql-10.7-2-linux-x64-binaries.tar.gz',
                'windows-x86': 'https://get.enterprisedb.com/postgresql/postgresql-10.7-2-windows-binaries.zip',
                'windows-x64': 'https://get.enterprisedb.com/postgresql/postgresql-10.7-2-windows-x64-binaries.zip',
                darwin: 'https://get.enterprisedb.com/postgresql/postgresql-10.7-2-osx-binaries.zip',
                'darwin-x64': 'https://get.enterprisedb.com/postgresql/postgresql-10.7-2-osx-binaries.zip',
            },
        },
        12: {
            0: {
                'linux-x86': 'https://get.enterprisedb.com/postgresql/postgresql-10.12-1-linux-binaries.tar.gz',
                'linux-x64': 'https://get.enterprisedb.com/postgresql/postgresql-10.12-1-linux-x64-binaries.tar.gz',
                'windows-x86': 'https://get.enterprisedb.com/postgresql/postgresql-10.12-1-windows-binaries.zip',
                'windows-x64': 'https://get.enterprisedb.com/postgresql/postgresql-10.12-1-windows-x64-binaries.zip',
                darwin: 'https://get.enterprisedb.com/postgresql/postgresql-10.12-1-osx-binaries.zip',
                'darwin-x64': 'https://get.enterprisedb.com/postgresql/postgresql-10.12-1-osx-binaries.zip',
            },
        },
    },
    9: {
        4: {
            21: {
                'linux-x86': 'https://get.enterprisedb.com/postgresql/postgresql-9.4.21-1-linux-binaries.tar.gz',
                'linux-x64': 'https://get.enterprisedb.com/postgresql/postgresql-9.4.21-1-linux-x64-binaries.tar.gz',
                'windows-x86': 'https://get.enterprisedb.com/postgresql/postgresql-9.4.21-1-windows-binaries.zip',
                'windows-x64': 'https://get.enterprisedb.com/postgresql/postgresql-9.4.21-1-windows-x64-binaries.zip',
                darwin: 'https://get.enterprisedb.com/postgresql/postgresql-9.4.21-1-osx-binaries.zip',
                'darwin-x64': 'https://get.enterprisedb.com/postgresql/postgresql-9.4.21-1-osx-binaries.zip',
            },
        },
        5: {
            16: {
                'linux-x86': 'https://get.enterprisedb.com/postgresql/postgresql-9.5.16-1-linux-binaries.tar.gz',
                'linux-x64': 'https://get.enterprisedb.com/postgresql/postgresql-9.5.16-1-linux-x64-binaries.tar.gz',
                'windows-x86': 'https://get.enterprisedb.com/postgresql/postgresql-9.5.16-1-windows-binaries.zip',
                'windows-x64': 'https://get.enterprisedb.com/postgresql/postgresql-9.5.16-1-windows-x64-binaries.zip',
                darwin: 'https://get.enterprisedb.com/postgresql/postgresql-9.5.16-1-osx-binaries.zip',
                'darwin-x64': 'https://get.enterprisedb.com/postgresql/postgresql-9.5.16-1-osx-binaries.zip',
            },
        },
        6: {
            12: {
                'linux-x86': 'https://get.enterprisedb.com/postgresql/postgresql-9.6.12-1-linux-binaries.tar.gz',
                'linux-x64': 'https://get.enterprisedb.com/postgresql/postgresql-9.6.12-1-linux-x64-binaries.tar.gz',
                'windows-x86': 'https://get.enterprisedb.com/postgresql/postgresql-9.6.12-1-windows-binaries.zip',
                'windows-x64': 'https://get.enterprisedb.com/postgresql/postgresql-9.6.12-1-windows-x64-binaries.zip',
                darwin: 'https://get.enterprisedb.com/postgresql/postgresql-9.6.12-1-osx-binaries.zip',
                'darwin-x64': 'https://get.enterprisedb.com/postgresql/postgresql-9.6.12-1-osx-binaries.zip',
            },
        },
    },
};
exports.default = (arch, version = '') => {
    const versionSet = version.split('.');
    let major = parseInt(versionSet[0], 10) || -1;
    let minor = parseInt(versionSet[1], 10) || -1;
    let patch = parseInt(versionSet[2], 10) || -1;
    if (major === -1) {
        major = Math.max.apply(null, Object.keys(versionMap));
    }
    const latestMajor = versionMap[major];
    if (!latestMajor) {
        throw new Error(`Version ${version} not supported`);
    }
    if (minor === -1) {
        minor = Math.max.apply(null, Object.keys(latestMajor));
    }
    const latestMinor = latestMajor[minor];
    if (!latestMinor) {
        throw new Error(`Version ${version} not supported`);
    }
    if (patch === -1) {
        patch = Math.max.apply(null, Object.keys(latestMinor));
    }
    const latestPatch = latestMinor[patch];
    if (!latestPatch || !latestPatch[arch]) {
        throw new Error(`Version ${version} not supported for architecure ${arch}`);
    }
    return {
        version: `${major}.${minor}.${patch}`,
        url: latestPatch[arch],
    };
};
//# sourceMappingURL=pgVersions.js.map