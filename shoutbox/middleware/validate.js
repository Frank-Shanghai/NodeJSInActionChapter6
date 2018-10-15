'use strict';

function parseField(field){
    console.log('Parse field: ' + field.split(/\[|\]/).filter((s)=>s));
    return field.split(/\[|\]/).filter((s)=>s);
}

function getField(req, field){
    let val = req.body;
    console.log("req body: " + val);
    field.forEach((prop) => {
        val = val[prop];
    });

    console.log('val: ' + val);
    return val;
}

exports.required = (field) => {
    field = parseField(field);
    return (req, res, next) => {
        if(getField(req, field)){
            next();
        }
        else{
            res.error(`${field.join(' ')} is required`);
            res.redirect('back');
        }
    };
};

exports.lengthAbove = (field, len) => {
    let parsedField = parseField(field);
    return (req, res, next) => {
        if(getField(req, parsedField).length > len){
            next();
        }
        else{
            const field = parsedField.join(' ');
            res.error(`${field} must have more than ${len} characters`);
            res.redirect('back');
        }
    };
};