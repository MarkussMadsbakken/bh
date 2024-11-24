import * as Minio from 'minio'

export function useMinio() {
    return new Minio.Client({
        endPoint: 'bh.tihlde.org',
        port: 9000,
        useSSL: false,
        accessKey: process.env.MINIO_USER ?? "",
        secretKey: process.env.MINIO_PASSWORD ?? "",
    })
}

export function useUserImage(filename: string) {
    return `http://bh.tihlde.org:9000/user-image/${filename}`
}