<template>
  <div class="container">
    <div class="container mt-4">
      <div class="flex justify-between items-center px-3">
        <button :disabled="isLoading == true" @click="showAddModal()"
          class="block text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button">
          add bloodRequest
        </button>

        <button :disabled="isLoading == true" @click="fetchbloodRequests" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3b82f6" viewBox="0 0 24 24">
            <path
              d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z" />
          </svg>
        </button>
      </div>
      <div class="table-responsive">
        <table class="table mt-4">

          <thead v-if="isLoading">
            <tr  class="bg-blue-500 text-white">
              <th>loading...</th>
            </tr>
          </thead>
          <thead v-else>
            <tr class="bg-blue-500 text-white">
              <th>patient name</th>
              <th>hospital name</th>
              <th>hospital location</th>
              <th>contact name</th>
              <th>contact phone number</th>
              <th>blood type needed</th>
              <th>quantity needed</th>
              <th>urgency level</th>
              <th>status</th>
              <th>center</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody v-if="isLoading">
            <tr>
              <td colspan="11">
                <div class="flex items-center justify-center h-full">
                  <LoadingSnippet />
                </div>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr v-if="bloodRequests.length === 0">
              <td>no bloodRequests</td>
            </tr>
            <tr v-else v-for="bloodRequest in bloodRequests" :key="bloodRequest.id">
              <td>{{ bloodRequest.patient_name }}</td>
              <td>{{ bloodRequest.hospital_name }}</td>
              <td>{{ bloodRequest.hospital_location }}</td>
              <td>{{ bloodRequest.contact_name }}</td>
              <td>{{ bloodRequest.contact_phone_number }}</td>
              <td>{{ bloodRequest.blood_type_needed }}</td>
              <td>{{ bloodRequest.quantity_needed }}</td>
              <td>{{ bloodRequest.urgency_level }}</td>
              <td>
                <span :class="getStatusClass(bloodRequest.status)">
                  {{ bloodRequest.status }}
                </span>
              </td>
              <td>{{ bloodRequest.center?.name }}</td>
              <td>
                <button v-if="bloodRequest.status == 'pending'" @click="editbloodRequest(bloodRequest.id)"
                  class="rounded px-4 py-1 text-sm border border-green-500 text-green-500 hover:bg-green-500 hover:text-blue-100 duration-300">
                  Edit
                </button>
                <button v-if="bloodRequest.status == 'pending'" @click="deletebloodRequest(bloodRequest.id)"
                  class="rounded px-4 py-1 text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-blue-100 duration-300">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>

  <!-- <transition name="fade"> -->
  <div v-if="isAddModalVisible == true" class="modal modal-fade animated fadeInUp">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          Add bloodRequest
        </h3>
        <button @click="isAddModalVisible = false" type="button" class="close-button">
          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"></path>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <div class="modal-body">
        <form method="post" @submit.prevent="addbloodRequest">
          <div v-if="errors && errors.general">
            <p class="text-red-500">{{ errors.general[0] }}</p>
          </div>
          <div class="mb-4">
            <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">patient name</label>
            <div v-if="errors && errors.patient_name">
              <p class="text-red-500">{{ errors.patient_name[0] }}</p>
            </div>
            <input type="text" v-model="newbloodRequest.patient_name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">

          </div>
          <div class="mb-4">
            <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">hospital name</label>
            <div v-if="errors && errors.hospital_name">
              <p class="text-red-500">{{ errors.hospital_name[0] }}</p>
            </div>
            <input type="text" v-model="newbloodRequest.hospital_name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">

          </div>
          <div class="mb-4">
            <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">hospital location</label>
            <div v-if="errors && errors.hospital_location">
              <p class="text-red-500">{{ errors.hospital_location[0] }}</p>
            </div>
            <input type="text" v-model="newbloodRequest.hospital_location"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="mb-4">
            <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">contact phone number</label>
            <div v-if="errors && errors.contact_phone_number">
              <p class="text-red-500">{{ errors.contact_phone_number[0] }}</p>
            </div>
            <input type="number" v-model="newbloodRequest.contact_phone_number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="mb-4">
            <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">quantity needed</label>
            <div v-if="errors && errors.quantity_needed">
              <p class="text-red-500">{{ errors.quantity_needed[0] }}</p>
            </div>
            <input type="number" v-model="newbloodRequest.quantity_needed"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div class="mb-4">
            <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">urgency level</label>
            <div v-if="errors && errors.urgency_level">
              <p class="text-red-500">{{ errors.urgency_level[0] }}</p>
            </div>
            <select v-model="newbloodRequest.urgency_level" id="urgency_level" name="urgency_level"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Center</option>
              <option value="immediate">immediate</option>
              <option value="24 hours">24 hours</option>
            </select>
            <input type="number" v-model="newbloodRequest.urgency_level">
          </div>
          <div class="mb-4">
            <label for="blood_type" class="block text-gray-700 text-sm font-bold mb-2">blood type</label>
            <div v-if="errors.blood_type">
              <p class="text-red-500">
                {{ errors.blood_type[0] }}
              </p>
            </div>
            <select v-model="newbloodRequest.blood_type_needed" id="blood_type" name="blood_type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Blood Type</option>
              <option v-for="type in bloodTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">center</label>
            <div v-if="errors && errors.center_id">
              <p class="text-red-500">{{ errors.center_id[0] }}</p>
            </div>
            <select v-model="newbloodRequest.center_id" id="center_id" name="center_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Center</option>
              <option v-for="type in centers" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <button :disabled="isProcessing === 'add'" type="submit" class="accept-button">
              {{ isProcessing === 'add' ? 'Processing' : 'Submit' }}
            </button>
            <button type="button" @click="isAddModalVisible = false" class="decline-button">
              close
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- </transition> -->

  <div v-if="Object.keys(editedbloodRequest).length !== 0">
    <!--edit modal-->
    <!-- <transition name="fade"> -->
    <div v-if="isEditModalVisible == true" class="modal modal-fade animated fadeInUp">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Add bloodRequest
          </h3>
          <button @click="isEditModalVisible = false" type="button" class="close-button">
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"></path>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="modal-body">
          <form method="post" @submit.prevent="updatebloodRequest">
            <div v-if="errors && errors.general">
              <p class="text-red-500">{{ errors.general[0] }}</p>
            </div>
            <div class="mb-4">
              <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">patient name</label>
              <div v-if="errors && errors.patient_name">
                <p class="text-red-500">{{ errors.patient_name[0] }}</p>
              </div>
              <input type="text" v-model="editedbloodRequest.patient_name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">

            </div>
            <div class="mb-4">
              <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">hospital name</label>
              <div v-if="errors && errors.hospital_name">
                <p class="text-red-500">{{ errors.hospital_name[0] }}</p>
              </div>
              <input type="text" v-model="editedbloodRequest.hospital_name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">

            </div>
            <div class="mb-4">
              <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">hospital location</label>
              <div v-if="errors && errors.hospital_location">
                <p class="text-red-500">{{ errors.hospital_location[0] }}</p>
              </div>
              <input type="text" v-model="editedbloodRequest.hospital_location"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="mb-4">
              <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">contact phone number</label>
              <div v-if="errors && errors.contact_phone_number">
                <p class="text-red-500">{{ errors.contact_phone_number[0] }}</p>
              </div>
              <input type="number" v-model="editedbloodRequest.contact_phone_number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="mb-4">
              <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">quantity needed</label>
              <div v-if="errors && errors.quantity_needed">
                <p class="text-red-500">{{ errors.quantity_needed[0] }}</p>
              </div>
              <input type="number" v-model="editedbloodRequest.quantity_needed"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="mb-4">
              <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">urgency level</label>
              <div v-if="errors && errors.urgency_level">
                <p class="text-red-500">{{ errors.urgency_level[0] }}</p>
              </div>
              <select v-model="editedbloodRequest.urgency_level" id="urgency_level" name="urgency_level"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Center</option>
                <option value="immediate">immediate</option>
                <option value="24 hours">24 hours</option>
              </select>
              <input type="number" v-model="editedbloodRequest.urgency_level">
            </div>
            <div class="mb-4">
              <label for="blood_type" class="block text-gray-700 text-sm font-bold mb-2">blood type</label>
              <div v-if="errors.blood_type">
                <p class="text-red-500">
                  {{ errors.blood_type[0] }}
                </p>
              </div>
              <select v-model="editedbloodRequest.blood_type_needed" id="blood_type" name="blood_type"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Blood Type</option>
                <option v-for="type in bloodTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">center</label>
              <div v-if="errors && errors.center_id">
                <p class="text-red-500">{{ errors.center_id[0] }}</p>
              </div>
              <select v-model="editedbloodRequest.center.id" id="center_id" name="center_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Center</option>
                <option v-for="type in centers" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>
            <div class="modal-footer">
              <button :disabled="isProcessing === 'add'" type="submit" class="accept-button">
                {{ isProcessing === 'add' ? 'Processing' : 'Submit' }}
              </button>
              <button type="button" @click="isEditModalVisible = false" class="decline-button">
                close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- </transition> -->
  </div>
</template>

<script>
import router from "@/router";
import LoadingSnippet from "./LoadingSnippet.vue";
import axios from "../axios";
import "../css/table.css";
import { useToast } from "vue-toastification";

export default {
  name: "BLoodRequestPage",
  data() {
    return {
      isLoading: false,
      isProcessing: "",
      bloodRequests: [],
      newbloodRequest: {
        patient_name: "",
        blood_type: "",
        hospital_name: "",
        hospital_location: "",
        contact_name: "",
        contact_phone_number: "",
        blood_type_needed: "",
        quantity_needed: "",
        urgency_level: "",
        status: "",
        center_id: "",
      },
      editedbloodRequest: {},
      bloodTypes: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      errors: {},
      centers: {},
      isAddModalVisible: false,
      isEditModalVisible: false,
    };
  },
  mounted() {
    this.fetchbloodRequests();
    this.fetchCenters();
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async fetchCenters() {
      await axios.get("/api/centers").then((response) => {
        this.centers = response.data.data;
      });
    },
    async fetchbloodRequests() {
      this.isLoading = true;
      await axios
        .get("/api/user/request", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        })
        .then((response) => {
          this.bloodRequests = response.data.data;
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            console.log("401 :>> ");
            this.$store.commit("LOGOUT");
            router.replace("/login");
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    showAddModal() {
      this.errors = {};
      this.isAddModalVisible = true;
    },
    async addbloodRequest() {
      this.isProcessing = "add";
      await axios
        .post(
          "/api/user/request",
          this.newbloodRequest,
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.getUserToken}`,
            },
          }
        )
        .then((response) => {
          this.newbloodRequest = {
            patient_name: "",
            hospital_name: "",
            hospital_location: "",
            contact_name: "",
            contact_phone_number: "",
            blood_type_needed: "",
            quantity_needed: "",
            urgency_level: "",
            status: "",
            center_id: "",
          }
          useToast().success(response.data.message, {
            timeout: 2000,
          });
          this.isProcessing = "";
          this.isAddModalVisible = false;
          this.fetchbloodRequests();
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            console.log("401 :>> ");
            this.$store.commit("LOGOUT");
            router.replace("/login");
          }
          if (error.response && error.response.status === 400 && error.response.data) {
            this.errors = error.response.data;
          } else {
            if (error.response.data.message) {
              useToast().info(error.response.data.message);
            }
            if (error.response.data.availabe_center) {
              this.newbloodRequest.center_id = error.response.data.availabe_center.id;
              useToast().info(error.response.data.message);
            }
          }
        }).finally(() => {
          this.isProcessing = "";
        });
    },
    async editbloodRequest(bloodRequestId) {
      this.errors = {};
      await axios
        .get(`/api/user/request/${bloodRequestId}`, {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        })
        .then((response) => {
          if (response.data.data) {
            this.editedbloodRequest = response.data.data;
            if (this.editedbloodRequest.status != "pending") {
              useToast().info('this request is completed so you cannot edit it');
              this.fetchbloodRequests();
            } else this.isEditModalVisible = true;
          }
        })
        .catch((error) => {
          console.log("error :>> ", error);
        });
    },
    updatebloodRequest() {
      this.isProcessing = "edit";
      let bloodRequest = {
        ...this.editedbloodRequest,
        center_id: this.editedbloodRequest.center.id
      };
      console.log('bloodRequest :>> ', bloodRequest);
      axios
        .put(
          `/api/user/request/${this.editedbloodRequest.id}`,
          bloodRequest,
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.getUserToken}`,
            },
          }
        )
        .then((response) => {
          console.log("response :>> ", response);
          this.editedbloodRequest = {};
          useToast().success(response.data.message, {
            timeout: 2000,
          });
          this.showEditModal = false;
          this.fetchbloodRequests();
        })
        .catch((error) => {
          console.log(error.response?.status);
          // if (error.response?.status === 401) {
          //   console.log("401 :>> ");
          //   this.$store.commit("LOGOUT");
          //   router.replace("/login");
          // }
          if (error.response && error.response.status === 400 && error.response.data) {
            this.errors = error.response.data;
            if (error.response.data.message) {
              useToast().info(error.response.data.message);
            }
          } else {
            if (error.response.data.availabe_center) {
              this.editedbloodRequest.center.id = error.response.data.availabe_center.id;
              const errorMessage = error.response.data.message.replace(/\n/g, ' ');
              const toastMessage = `${errorMessage} we choose the center ${this.editedbloodRequest.center.name} it has the needed quantity. Resubmit to proceed.`;
              useToast().info(toastMessage);
            }
            if (error.response.message) {
              useToast().info(error.response.message);
            }
          }
          console.log(error);
        })
        .finally(() => {
          this.isProcessing = "";
        });
    },
    deletebloodRequest(bloodRequestId) {
      if (confirm("Are you sure you want to delete this bloodRequest?")) {
        axios
          .delete(
            `/api/user/request/${bloodRequestId}`,
            {
              headers: {
                Authorization: `Bearer ${this.$store.getters.getUserToken}`,
              },
            }
          )
          .then((response) => {
            useToast().success(response.data.message, {
              timeout: 2000,
            });
            this.fetchbloodRequests();
          })
          .catch((error) => {
            if (error.response?.status === 401) {
              console.log("401 :>> ");
              this.$store.commit("LOGOUT");
              router.replace("/login");
            }
            if (error.response.data.message) {
              useToast().error(error.response.data.message, {
                timeout: 2000,
              });
            }
          });
      }
    },
    getStatusClass(status) {
      if (status === 'cancelled') {
        return 'h-1/2 px-2 py-1 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-400';
      } else if (status === 'fulfilled') {
        return 'h-1/2 px-2 py-1 text-sm text-green-800 rounded-lg bg-green-100 dark:bg-gray-800 dark:text-green-400';
      } else {
        return 'h-1/2 px-2 py-1 text-sm text-yellow-800 rounded-lg bg-yellow-100 dark:bg-gray-800 dark:text-yellow-300"';
      }
    },
  },
  components: {
    LoadingSnippet,
  },
};
</script>

<style>
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 500ms ease-out;
}

button:disabled {
  cursor: not-allowed;
}
</style>
