const AWS = require('aws-sdk');

const uploadToS3 = (data, filename) => {
    const BUCKET_NAME = 'expensetrackerproject';
    const IAM_USER_KEY = process.env.AWS_IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.AWS_IAM_USER_SECRET;

    //console.log("hey there", IAM_USER_KEY, IAM_USER_SECRET)

    // make new instance with keys to access
    let s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })
//create bucket with parameter to upload
//our bucket is already created in S3, so no need to create again
/*
    s3Bucket.createBucket(() => {
        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data
        }
*/
        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read' // to give public access to file
        }

        return new Promise((resolve, reject) => {
            s3Bucket.upload(params, (err, s3response) => {
                if(err) {
                    console.log('Something went wrong');
                    reject(err);
                }
                else {
                    console.log('success', s3response);
                    resolve(s3response.Location);
                }
            })
        });
}

module.exports = {
    uploadToS3,
}