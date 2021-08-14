const { unlink, writeFile, readFile } = require('fs/promises');

const log = require('../config/winston');

const deleteFile = async (path) => {
    try {
        await unlink(path);
        log.info('file deleted');
    } catch (error) {
        log.error(error);
    }
};

const writeJSON = async (data, filename) => {
    try {
        const json = JSON.stringify(data);
        await writeFile(`data/${filename}.json`, json, 'utf8');
    } catch (error) {
        log.error(`Writing JSON id: ${filename}\n${error}`);
    }
};

const getJSON = async (filename) => {
    try {
        const data = await readFile(`data/${filename}.json`, 'utf8');

        return { status: true, data: JSON.parse(data) };
    } catch (error) {
        log.error(`Reading JSON id:${filename}\n${error}`);

        return { status: false, error: error };
    }
};

module.exports = { deleteFile, writeJSON, getJSON };
