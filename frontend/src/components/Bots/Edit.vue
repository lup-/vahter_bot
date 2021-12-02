<template>
  <v-container class="fill-height align-start">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>{{ isNew ? 'Новый бот' : 'Редактирование бота' }}</v-card-title>
          <v-card-text>
            <v-form autocomplete="off">

              <v-row class="mt-4">
                <v-col cols="12">
                  <v-text-field
                      v-model="item.token"
                      hint="Токен бота"
                      persistent-hint
                      outlined
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-combobox v-model="item.needsSubscription"
                          label="Требовать подписку"
                          multiple
                          chips
                          deletable-chips
                          hint="Например: @vcblr"
                          persistent-hint
              ></v-combobox>

              <v-row class="mt-4">
                <v-col cols="12">
                  <v-textarea
                      v-model="item.introMessage"
                      label="Текст приветствия"
                      outlined
                  ></v-textarea>
                </v-col>
              </v-row>

              <v-row class="mt-4">
                <v-col cols="12">
                  <v-textarea
                      v-model="item.fileMessage"
                      label="Текст сообщения с файлами"
                      outlined
                  ></v-textarea>
                </v-col>
              </v-row>

              <v-row class="mt-4">
                <v-col cols="12">
                  <v-file-input
                      v-model="file"
                      label="Файлы"
                      persistent-hint
                      outlined
                      @change="addFile"
                  ></v-file-input>
                </v-col>
              </v-row>

              <v-row class="my-4" v-if="uploaded && uploaded.length > 0">
                <v-col cols="12">
                  <v-chip v-for="(file, index) in uploaded" :key="file.name"
                          class="mr-2 mb-2"
                          close
                          close-icon="mdi-delete"
                          @click:close="deleteFile(index)"
                  >
                    {{file.name}}
                  </v-chip>
                </v-col>
              </v-row>

            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="gotoList">К списку</v-btn>
            <v-btn large color="primary" @click="save">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CrudEdit from '@/components/CrudEdit';
import UploadFiles from "@/mixins/UploadFiles";
import clone from "lodash.clonedeep";

export default {
  mixins: [UploadFiles],
  extends: CrudEdit,
  data() {
    return {
      item: {},
      file: null,

      ACTION_LOAD: 'bot/loadItems',
      ACTION_NEW: 'bot/newItem',
      ACTION_SAVE: 'bot/saveItem',
      ACTION_SET_EDIT_ITEM: 'bot/setEditItem',
      ROUTE_LIST: 'botsList',
      STORE_MODULE: 'bot'
    }
  },
  async created() {
    if (this.itemId) {
      if (this.allItems.length === 0) {
        await this.$store.dispatch(this.ACTION_LOAD);
      }

      this.$store.dispatch(this.ACTION_SET_EDIT_ITEM, this.itemId);
    }
  },
  watch: {
    storeItem() {
      if (this.storeItem) {
        this.item = this.storeItem;
        this.uploaded = this.item.files;
      }
    },
  },
  methods: {
    async save() {
      let item = clone(this.item);
      item.files = this.uploaded

      if (this.isNew()) {
        await this.$store.dispatch(this.ACTION_NEW, item);
      }
      else {
        await this.$store.dispatch(this.ACTION_SAVE, item);
      }

      return this.gotoList();
    },
  },
  computed: {}
}
</script>

<style scoped>

</style>