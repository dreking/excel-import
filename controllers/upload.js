const { createReadStream } = require('fs');
const { Workbook } = require('exceljs');

const { deleteFile } = require('../utils/file');
const log = require('../config/winston');
const { validateExcel } = require('../validations/upload');
const paginate = require('../utils/paginate');

const RawData = require('../models/rawdata');
const Data = require('../models/data');

exports.postUploadFile = async (req, res) => {
    const { file } = req;

    // Return response with id as soon as the file is accepted as excel file
    res.status(200).json({
        status: true,
        message: 'File uploaded successfully',
        id: file.filename,
    });

    try {
        // Create stream for better perfomance
        const stream = createReadStream(file.path);
        const workbook = new Workbook();
        const data = await workbook.xlsx.read(stream);

        const rawData = [];

        // Get first worksheet
        const worksheet = data.worksheets[0];

        // Get first row which is a header
        const row = worksheet.getRow(1);
        const headers = [...row.values];

        // Loop through excel row and cells and put them in a data structure
        worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            if (rowNumber !== 1) {
                const it = {};
                row.eachCell(function (cell, colNumber) {
                    const { value } = cell;
                    const header = headers[colNumber].toLowerCase();

                    // Validate cell
                    const validationError = validateExcel({
                        header: header,
                        value: value.toString(),
                    });

                    it[header] = value;
                    it[`${header}-validation`] = validationError ?? 'none';
                });

                rawData.push(it);
            }
        });

        // Create temp JSON file and save data in db
        await RawData.create({
            name: file.filename,
            data: JSON.stringify({ headers: headers, data: rawData }),
        });
    } catch (error) {
        log.error(error, error);
    } finally {
        // Delete uploaded excel file
        deleteFile(file.path);
    }
};

exports.getUploadedData = async (req, res) => {
    const { id } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const rawdata = await RawData.findOne({ where: { name: id } });
    const { data } = JSON.parse(rawdata.data);

    const paginatedData = paginate(data, page, limit);

    return res.status(200).json({
        status: true,
        message: 'Data found',
        count: data.length,
        data: paginatedData,
    });
};

exports.postCommitData = async (req, res) => {
    const { status, id } = req.body;

    if (status === 'no') {
        await RawData.destroy({ where: { name: id } });

        return res.status(200).json({
            status: true,
            message: 'Data discarded successfully',
        });
    }

    res.status(201).json({ status: true, message: 'Data is being committed' });

    try {
        const rawdata = await RawData.findOne({ where: { name: id } });
        const { data } = JSON.parse(rawdata.data);

        await Data.bulkCreate(data);

        // We delete record after committing to avoid duplicates
        await RawData.destroy({ where: { name: id } });

        return true;
    } catch (error) {
        log.error(`Failed while committing: ${id}\n${error}`, error);

        return false;
    }
};

// POST UPLOAD FILE
/**
 * Using JSON Files instead of storing in DB
 *
 * const {  writeJSON } = require('../utils/file');
 *
 * writeJSON({ headers: headers, data: rawData }, file.filename);
 */

// GET UPLOADED DATA
/**
 * Using JSON Files instead of storing in DB
 *
 * const { getJSON } = require('../utils/file');
 *
 * const json = await getJSON(id);
 * if (!json || !json.status)
 *  return res.status(400).json({
 * 		status: false,
 * 		message: 'Something went wrong retriving data. Please try again later',
 * 	});
 * const { data: { data }, } = json;
 */

// COMMIT DATA TO DB
/**
 * Using JSON Files instead of storing in DB
 *
 * 	const { deleteFile } = require('../utils/file');
 *
 * 	Delete on no action
 * 	deleteFile(`data/${id}.json`);
 *
 * 	const json = await getJSON(id);
 * 	if (!json || !json.status) {
 * 		log.error(`Failed while committing: ${id}\n${json}`, json);
 * 		return false;
 * 	}
 *
 * 	const { data: { data } } = json;
 *
 *	We can delete file if we want after committing
 *	deleteFile(`data/${id}.json`);
 */
