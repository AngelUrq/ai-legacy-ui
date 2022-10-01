import * as THREE from "three";

export function createPlanet(texture, textureLoader,pdfData) {
  const size = getRandom(5, 30);

  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture[getRandom(0, texture.length - 1)]),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  /*const pdfData ={
    "documents": [
      {
        "summary": "sumary test",
        "copyright": "GOV_PUBLIC_USE_PERMITTED",
        "subjectCategories": ["INSTRUMENTATION AND PHOTOGRAPHY"],
        "distributionDate": "2019-06-17T00:00:00.0000000+00:00",
        "otherReportNumbers": ["TM-69-1022-3", "NASA-CR-106457"],
        "fundingNumbers": [{ "number": "NASW-417", "type": "CONTRACT_GRANT" }],
        "title": "Dynamic distortion of a gimbaled telescope",
        "stiType": "CONTRACTOR_REPORT",
        "distribution": "PUBLIC",
        "submittedDate": "2013-08-05T00:20:00.0000000+00:00",
        "authorAffiliations": [
          {
            "sequence": 0,
            "submissionId": 19690031409,
            "meta": {
              "author": { "name": "Anderson, G. M." },
              "organization": {
                "name": "Bellcomm, Inc.",
                "location": "Washington, DC, United States"
              }
            },
            "id": "f9deee32a6964e29848763416a27b3c3"
          }
        ],
        "stiTypeDetails": "Contractor Report (CR)",
        "technicalReviewType": "TECHNICAL_REVIEW_TYPE_NONE",
        "modified": "2013-04-09T00:00:00.0000000+00:00",
        "id": 19690031409,
        "created": "2013-08-05T00:20:00.0000000+00:00",
        "center": {
          "code": "CDMS",
          "name": "Legacy CDMS",
          "id": "092d6e0881874968859b972d39a888dc"
        },
        "onlyAbstract": false,
        "sensitiveInformation": 2,
        "abstract": "Dynamic distortion of gimbaled telescope",
        "isLessonsLearned": false,
        "disseminated": "DOCUMENT_AND_METADATA",
        "publications": [
          {
            "submissionId": 19690031409,
            "id": "38255f892641493e889df0316848e97d",
            "publicationDate": "1969-05-21T00:00:00.0000000+00:00"
          }
        ],
        "status": "CURATED",
        "related": [],
        "downloads": [
          {
            "draft": false,
            "mimetype": "application/pdf",
            "name": "19690031409.pdf",
            "type": "STI",
            "links": {
              "original": "/api/citations/19690031409/downloads/19690031409.pdf",
              "pdf": "/api/citations/19690031409/downloads/19690031409.pdf",
              "fulltext": "/api/citations/19690031409/downloads/19690031409.txt"
            }
          }
        ],
        "downloadsAvailable": true,
        "index": "submissions-2022-09-30-06-07"
      }
    ]
  }*/
  if (pdfData) {
    mesh.userData.title = pdfData.documents.title;
    mesh.userData.summary = pdfData.documents.summary;
    mesh.userData.id = pdfData.documents.id;
    mesh.userData.link = pdfData.documents.downloads.links;
    mesh.userData.keywords = pdfData.documents.keywords;
  }
  obj.add(mesh);

  mesh.position.x = getRandom(-500, 500);
  mesh.position.y = getRandom(-500, 500);
  mesh.position.z = 0

  return { mesh, obj };
}

export function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
