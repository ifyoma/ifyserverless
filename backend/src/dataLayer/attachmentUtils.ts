import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import 'source-map-support/register'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

export class AttachmentUtils {

    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = process.env.ATTACHMENT_BUCKET_NAME,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) { }

    async getAttachmentUrl(attachmentId: string): Promise<string> {
        return `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
    }

    async getUploadUrl(attachmentId: string): Promise<string> {
        const uploadUrl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: attachmentId,
            Expires: parseInt(this.urlExpiration)
        })

        return uploadUrl
    }

}
