const StudyMaterial =
require("../models/StudyMaterial");

exports.generateMaterialNumber =
async() => {

    const latestMaterial =
    await StudyMaterial
        .findOne({})
        .sort({ createdAt:-1 })
        .select("materialNumber");

    if(
        !latestMaterial ||
        !latestMaterial.materialNumber
    ){

        return "SM-000001";

    }

    const lastNumber =
    parseInt(
        latestMaterial
            .materialNumber
            .split("-")[1],
        10
    );

    const nextNumber =
    lastNumber + 1;

    return `SM-${String(nextNumber).padStart(6,"0")}`;

};