<template>
  <div class="container flex flex-col items-center md:w-3/4">
    <div class="container mt-4">
      <div class="flex justify-between items-center px-3">
        <button :disabled="isLoading || isOnline === false" @click="showAddModal()"
          class="block text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button">
          add appointment
        </button>

        <button :disabled="isLoading || isOnline === false" @click="reloadAppointment" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3b82f6" viewBox="0 0 24 24">
            <path
              d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z" />
          </svg>
        </button>
      </div>
      <div class="table-responsive flex content-center">
        <table class="table mt-4">
          <thead v-if="isLoading">
            <tr class="bg-blue-500 text-white">
              <th>loading...</th>
            </tr>
          </thead>
          <thead v-else>
            <tr class="bg-blue-500 text-white">
              <th>status</th>
              <th>date</th>
              <th>time</th>
              <th>center</th>
              <th>bloodtype</th>
              <th>quantity</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody v-if="isLoading">
            <tr>
              <td colspan="7">
                <div class="flex items-center justify-center h-full">
                  <LoadingSnippet />
                </div>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr v-if="appointments.length === 0">
              <td>no appointments</td>
            </tr>
            <tr v-else v-for="appointment in appointments" :key="appointment.id">
              <td>{{ appointment.status }}</td>
              <td>{{ appointment.date }}</td>
              <td>{{ appointment.time }}</td>
              <td>{{ appointment.center?.name }}</td>
              <td>{{ appointment.blood_type }}</td>
              <td>{{ appointment.quantity }}</td>
              <td>
                <button :disabled="isOnline === false" v-if="appointment.status == 'scheduled'"
                  @click="editAppointment(appointment.id)"
                  class="rounded px-4 py-1 text-sm border border-green-500 text-green-500 hover:bg-green-500 hover:text-blue-100 duration-300">
                  Edit
                </button>
                <button :disabled="isOnline === false" v-if="appointment.status == 'scheduled'"
                  @click="deleteAppointment(appointment.id)"
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
  <Transition>
    <div v-if="isAddModalVisible === true" class="modal-background">
    </div>
  </Transition>
  <Transition>
    <div v-if="isAddModalVisible === true" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Add appointment
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
          <form method="post" @submit.prevent="addAppointment">
            <div v-if="!newAppointment.date || !newAppointment.center_id" class="info text-blue-500">
              you must choose center and date to show avaialble times
            </div>
            <div v-if="errors && errors.general">
              <p class="text-red-500">{{ errors.general[0] }}</p>
            </div>
            <div class="mb-4">
              <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">Center</label>
              <div v-if="errors && errors.center_id">
                <p class="text-red-500">{{ errors.center_id[0] }}</p>
              </div>
              <select v-model="newAppointment.center_id" id="center_id" name="center_id" @change="getAvailableTime('add')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Center</option>
                <option v-for="type in centers" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>
            <!-- <div class="mb-4">
              <label for="blood_type" class="block text-gray-700 text-sm font-bold mb-2">blood type</label>
              <div v-if="errors.blood_type">
                <p class="text-red-500">
                  {{ errors.blood_type[0] }}
                </p>
              </div>
              <select v-model="newAppointment.blood_type" id="blood_type" name="blood_type"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Blood Type</option>
                <option v-for="type in bloodTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div> -->
            <div class="mb-4">
              <label for="date" class="block text-gray-700 text-sm font-bold mb-2">Date:</label>
              <div v-if="errors.date">
                <p class="text-red-500">{{ errors.date[0] }}</p>
              </div>
              <input v-model="newAppointment.date" type="date" id="date" name="date" @change="getAvailableTime('add')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div v-if="isProcessing === 'getTimes' &&
              newAppointment.center_id &&
              newAppointment.date">
              get available times...
            </div>
            <div v-if="availableTimes.length > 0 && newAppointment.date && newAppointment.center_id" class="mb-4">
              <label for="time" class="block text-gray-700 text-sm font-bold mb-2">Time:</label>
              <div v-if="errors.time">
                <p class="text-red-500">
                  {{ errors.time[0] }}
                </p>
              </div>
              <select v-model="newAppointment.time" id="time" name="time"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">select time</option>
                <option v-for="time in availableTimes" :key="time" :value="time">
                  {{ time }}
                </option>
              </select>
            </div>
            <div class="modal-footer">
              <button :disabled="isProcessing === 'add' || isOnline === false" type="submit" class="accept-button">
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
  </Transition>

  <div v-if="Object.keys(editedAppointment).length !== 0">
    <Transition>
      <div v-if="isEditModalVisible === true" class="modal-background">
      </div>
    </Transition>
    <Transition>
      <div v-if="isEditModalVisible == true" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              edit appointment
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
            <form method="post" @submit.prevent="updateAppointment">
              <div v-if="!editedAppointment.date || !editedAppointment.center || !editedAppointment.center.id"
                class="info text-blue-500">
                you must choose center and date to show avaialble times
              </div>
              <div v-if="errors && errors.general">
                <p class="text-red-500">{{ errors.general[0] }}</p>
              </div>
              <div class="mb-4">
                <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">center:</label>
                <div v-if="errors && errors.center_id">
                  <p class="text-red-500">{{ errors.center_id[0] }}</p>
                </div>
                <select v-model="editedAppointment.center.id" id="center_id" name="center_id"
                  @change="getAvailableTime('update')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Center</option>
                  <option v-for="type in centers" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <!-- <div class="mb-4">
                <label for="blood_type" class="block text-gray-700 text-sm font-bold mb-2">center</label>
                <div v-if="errors.blood_type">
                  <p class="text-red-500">
                    {{ errors.blood_type[0] }}
                  </p>
                </div>
                <select v-model="editedAppointment.blood_type" id="blood_type" name="blood_type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Blood Type</option>
                  <option v-for="type in bloodTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div> -->
              <div class="mb-4">
                <label for="date" class="block text-gray-700 text-sm font-bold mb-2">Date:</label>
                <div v-if="errors.date">
                  <p class="text-red-500">{{ errors.date[0] }}</p>
                </div>
                <input v-model="editedAppointment.date" type="date" id="date" name="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div v-if="isProcessing === 'getTimes' &&
                editedAppointment.center_id &&
                editedAppointment.date">
                get available times...
              </div>
              <div v-if="availableTimes.length > 0 && editedAppointment.date && editedAppointment.center.id" class="mb-4">
                <label for="time" class="block text-gray-700 text-sm font-bold mb-2">Time:</label>
                <div v-if="errors.time">
                  <p class="text-red-500">
                    {{ errors.time[0] }}
                  </p>
                </div>
                <select v-model="editedAppointment.time" id="time" name="time"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">select time</option>
                  <option v-for="time in availableTimes" :key="time" :value="time">
                    {{ time }}
                  </option>
                </select>
              </div>
              <div class="modal-footer">
                <button type="submit" class="accept-button">edit</button>
                <button type="button" @click="isEditModalVisible = false" class="decline-button">
                  close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import router from "@/router";
import LoadingSnippet from "./LoadingSnippet.vue";
import axios from "../axios";
import "../css/table.css";
import { eventBus } from '../eventBus';
import { useToast } from "vue-toastification";

export default {
  name: "AppointmentPage",
  data() {
    return {
      isOnline: navigator.onLine ? true : false,
      isProcessing: "false",
      isLoading: false,
      appointments: [],
      newAppointment: {
        center_id: "",
        date: "",
        time: "",
        blood_type: "",
      },
      availableTimes: {},
      editedAppointment: {},
      bloodTypes: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      errors: {},
      centers: {},
      isAddModalVisible: false,
      isEditModalVisible: false,
    };
  },
  mounted() {
    window.addEventListener('online', () => { this.isOnline = true });
    window.addEventListener('offline', () => { this.isOnline = false })

    this.fetchCenters();
    this.fetchAppointments();
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    reloadAppointment() {
      eventBus.emit('isProcessing', 'appointments')
      this.fetchAppointments();
    },
    fetchCenters() {
      axios.get("/api/centers").then((response) => {
        this.centers = response.data.data;
      });
    },
    async fetchAppointments() {
      this.isLoading = true;
      await axios
        .get("/api/user/appointment", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        })
        .then((response) => {
          console.log('response :>> ', response);
          this.appointments = response.data.data;
          eventBus.emit("updateCount", {
            appointments: this.appointments.length,
          });
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            console.log("401 :>> ");
            this.$store.commit("LOGOUT");
            router.replace("/login");
          }
          if (error.response?.status === 401) {
            console.log("401 :>> ");
            this.$store.commit("LOGOUT");
            router.replace("/login");
          }
        })
        .finally(() => {
          this.isLoading = false;
          console.log(this.appointments);
        });
    },
    async getAvailableTime(type = "") {
      // if (!this.newAppointment.center_id) {
      //   useToast().info('please choose center to be able to get times');
      //   return;
      // }
      // if (!this.newAppointment.date) {
      //   useToast().info('please choose date to be able to get times at selected center');
      //   return;
      // }
      type === "update" ? console.log('editedAppointment :>> ', this.editedAppointment) : console.log('sds :>> ');
      let data = type === 'add' ? {
        'date': this.newAppointment.date,
        'center_id': this.newAppointment.center_id,
      } : {
        'date': this.editedAppointment.date,
        'center_id': this.editedAppointment.center.id,
        'appointment_id': this.editedAppointment.id,
      }
      this.isProcessing = "getTimes";
      axios.post('/api/user/appointment/availalbe-time', data, {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getUserToken}`,
        },
      })
        .then(response => {
          this.availableTimes = response.data;
          console.log('object :>> ', this.availableTimes);
        }).catch(error => {
          console.log('error :>> ', error);
        }).finally(() => {
          this.isProcessing = "";
        })
    },
    showAddModal() {
      this.newAppointment.center_id = "";
      this.newAppointment.date = "";
      this.newAppointment.time = "";
      this.errors = {};
      this.isAddModalVisible = true;
    },
    async addAppointment() {
      this.isProcessing = "add";
      await axios
        .post(
          "/api/user/appointment",
          this.newAppointment,
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.getUserToken}`,
            },
          }
        )
        .then((response) => {
          this.isAddModalVisible = false;
          useToast().success(response.data.message, {
            timeout: 2000,
          });
          this.newAppointment.center_id = "";
          this.newAppointment.date = "";
          this.newAppointment.time = "";
          this.loadAppointments();
        })
        .catch((error) => {
          console.log('error :>> ', error);
          if (error.response?.status === 401) {
            console.log("401 :>> ");
            this.$store.commit("LOGOUT");
            router.replace("/login");
          }
          if (
            error.response &&
            error.response.status === 412 &&
            error.response.data
          ) {
            this.errors = error.response.data;
          }
        })
        .finally(() => {
          this.isProcessing = "";
        });
    },
    async loadAppointments() {
      eventBus.emit('isProcessing', 'appointments');
      this.fetchAppointments();
    },
    async editAppointment(appointmentId) {
      this.errors = {};
      await axios
        .get(`/api/user/appointment/${appointmentId}`, {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        })
        .then(async (response) => {
          if (response.data.data) {
            this.editedAppointment = response.data.data;
            if (this.editedAppointment.status != 'scheduled') {
              useToast().info('this appointemnt is complete and cannot be edited');
              this.fetchAppointments()
            } else {

              await this.getAvailableTime('update');
              this.isEditModalVisible = true;
            }
          }
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            console.log("401 :>> ");
            this.$store.commit("LOGOUT");
            router.replace("/login");
          }
          console.log("error :>> ", error);
        });
    },
    updateAppointment() {
      let appointment = {
        center_id: this.editedAppointment.center.id,
        blood_type: this.editedAppointment.blood_type,
        date: this.editedAppointment.date,
        time: this.editedAppointment.time,
      };
      axios
        .put(
          `/api/user/appointment/${this.editedAppointment.id}`,
          appointment,
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.getUserToken}`,
            },
          }
        )
        .then((response) => {
          this.editedAppointment = {};
          useToast().success(response.data.message);
          this.showEditModal = false;
          this.fetchAppointments();
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            console.log("401 :>> ");
            this.$store.commit("LOGOUT");
            router.replace("/login");
          }
          if (error.response.data.message) {
            useToast().error(error.response.data.message);
          } else if (error.response.data) {
            this.errors = error.response.data;
          }
          console.log(error);
        });
    },
    deleteAppointment(appointmentId) {
      if (confirm("Are you sure you want to delete this appointment?")) {
        axios.delete(
          `/api/user/appointment/${appointmentId}`,
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
            this.loadAppointments();
          })
          .catch((error) => {
            if (error.response?.status === 401) {
              console.log("401 :>> ");
              this.$store.commit("LOGOUT");
              router.replace("/login");
            }
            if (error.response.data.message) {
              console.log("message :>> ");
              useToast().error(error.response.data.message, {
                timeout: 2000,
              });
            }
          });
      }
    },
  },
  components: {
    LoadingSnippet,
  },
};
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity .2s ease-in-out, transform .3s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-40%);
}

button:disabled {
  cursor: not-allowed;
}
</style>


