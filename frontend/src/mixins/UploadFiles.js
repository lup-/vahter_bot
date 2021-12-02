import axios from "axios";

export default {
    data() {
        return {
            file: null,
            uploaded: [],
        }
    },
    methods: {
        async uploadToServer(file) {
            let requestData = new FormData();
            requestData.append('file', file);

            let {data} = await axios.post( '/api/file/link',
                requestData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            return data;
        },

        async addFile() {
            if (!this.file) {
                return;
            }

            this.$store.commit('setLoading', true);

            try {
                let file = this.file;

                let uploadData = await this.uploadToServer(file);
                let fileData = {
                    file,
                    serverFile: uploadData.file,
                    src: uploadData.link,
                    type: file.type,
                    name: file.name,
                };


                if (!this.uploaded) {
                    this.uploaded = [];
                }

                this.uploaded.push(fileData);
            }
            catch (e) {
                this.$store.commit('setErrorMessage', 'Ошибка загрузки файла: ' + e.toString());
            }
            finally {
                this.$store.commit('setLoading', false);
                this.file = null;
            }
        },
        async deleteFile(index) {
            let file = this.uploaded[index];
            let {data} = await axios.post( '/api/file/delete', {file: file.serverFile});
            if (data.success) {
                this.uploaded.splice(index, 1);
            }
            else {
                this.$store.commit('setErrorMessage', 'Ошибка удаления файла: ' + data.error);
            }
        },
    }
}