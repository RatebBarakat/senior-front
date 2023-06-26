<template>
  <div class="container">
    <div class="container mt-4">
      <button @click="showAddModal()"
        class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button">
        add appointment
      </button>
      <table class="table mt-4">
        <thead>
          <tr>
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
            <td>{{ appointment.quantity ?? "not completed" }}</td>
            <td>
              <button @click="editAppointment(appointment.id)"
                class="bg-transparent mr-2 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                Edit
              </button>
              <button @click="deleteAppointment(appointment.id)"
                class="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>



  <div v-if="isAddModalVisible == true" class="modal">
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
          <div v-if="errors && errors.general">
            <p class="text-red-500">{{ errors.general[0] }}</p>
          </div>
          <div class="mb-4">
            <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">Center ID:</label>
            <div v-if="errors && errors.center_id">
              <p class="text-red-500">{{ errors.center_id[0] }}</p>
            </div>
            <select v-model="newAppointment.center_id" id="center_id" name="center_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Center</option>
              <option v-for="type in centers" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="blood_type" class="block text-gray-700 text-sm font-bold mb-2">Center ID:</label>
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
          </div>
          <div class="mb-4">
            <label for="date" class="block text-gray-700 text-sm font-bold mb-2">Date:</label>
            <div v-if="errors.date">
              <p class="text-red-500">{{ errors.date[0] }}</p>
            </div>
            <input v-model="newAppointment.date" type="date" id="date" name="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div class="mb-4">
            <label for="time" class="block text-gray-700 text-sm font-bold mb-2">Time:</label>
            <div v-if="errors.time">
              <p class="text-red-500">
                {{ errors.time[0] }}
              </p>
            </div>
            <input v-model="newAppointment.time" type="time" id="time" name="time"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div class="modal-footer">
            <button type="submit" class="accept-button">submit</button>
            <button type="button" @click="isAddModalVisible = false" class="decline-button">
              close
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div v-if="Object.keys(editedAppointment).length !== 0"><!--edit modal-->
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
            <div v-if="errors && errors.general">
              <p class="text-red-500">{{ errors.general[0] }}</p>
            </div>
            <div class="mb-4">
              <label for="center_id" class="block text-gray-700 text-sm font-bold mb-2">Center ID:</label>
              <div v-if="errors && errors.center_id">
                <p class="text-red-500">{{ errors.center_id[0] }}</p>
              </div>
              <select v-model="editedAppointment.center.id" id="center_id" name="center_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Center</option>
                <option v-for="type in centers" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label for="blood_type" class="block text-gray-700 text-sm font-bold mb-2">Center ID:</label>
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
            </div>
            <div class="mb-4">
              <label for="date" class="block text-gray-700 text-sm font-bold mb-2">Date:</label>
              <div v-if="errors.date">
                <p class="text-red-500">{{ errors.date[0] }}</p>
              </div>
              <input v-model="editedAppointment.date" type="date" id="date" name="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div class="mb-4">
              <label for="time" class="block text-gray-700 text-sm font-bold mb-2">Time:</label>
              <div v-if="errors.time">
                <p class="text-red-500">
                  {{ errors.time[0] }}
                </p>
              </div>
              <input v-model="editedAppointment.time" type="time" id="time" name="time"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
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
  </div>
</template>

<script>
import router from "@/router";
import LoadingSnippet from "./LoadingSnippet.vue";
import axios from "axios";
import "../css/table.css";
import { useToast } from "vue-toastification";

export default {
  name: "AppointmentPage",
  data() {
    return {
      isLoading: false,
      appointments: [],
      newAppointment: {
        center_id: "",
        date: "",
        time: "",
        blood_type: "",
      },
      editedAppointment: {
      },
      bloodTypes: [
        "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
      ],
      errors: {},
      centers: {},
      isAddModalVisible: false,
      isEditModalVisible: false
    };
  },
  mounted() {
    this.fetchAppointments();
    this.fetchCenters();
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async fetchCenters() {
      await axios.get('http://127.0.0.1:8000/api/centers')
        .then((response) => {
          this.centers = response.data.data;
          console.log('response :>> ', response.data.data);
        })
    },
    async fetchAppointments() {
      this.isLoading = true;
      await axios
        .get("http://127.0.0.1:8000/api/user/appointment", {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        })
        .then((response) => {
          this.appointments = response.data.data.appointments;
        })
        .catch((error) => {
          console.log("error", error);
          if (error.response?.status === 401) {
            console.log("401 :>> ");
            this.$store.commit("LOGOUT");
            router.push("/login");
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    showAddModal() {
      this.newAppointment.center_id = "";
      this.newAppointment.date = "";
      this.newAppointment.time = "";
      this.errors = {};
      this.isAddModalVisible = true;
    },
    async addAppointment() {
      await axios
        .post(
          "http://127.0.0.1:8000/api/user/appointment",
          this.newAppointment,
          {
            headers: {
              Authorization: `Bearer ${this.$store.getters.getUserToken}`,
            },
          }
        )
        .then((response) => {
          this.newAppointment.center_id = "";
          this.newAppointment.date = "";
          this.newAppointment.time = "";
          useToast().success(response.data.message, {
            timeout: 2000
          });
          this.isAddModalVisible = false;
          this.fetchAppointments();
        })
        .catch((error) => {
          console.log('error :>> ', error);
          if (
            error.response &&
            error.response.status === 400 &&
            error.response.data
          ) {
            this.errors = error.response.data;
            console.log('errors :>> ', this.errors);
          }
        });
    },
    async editAppointment(appointmentId) {
      await axios.get(`http://127.0.0.1:8000/api/user/appointment/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${this.$store.getters.getUserToken}`,
        },
      })
        .then((response) => {
          if (response.data.data) {
            this.editedAppointment = response.data.data;
            this.isEditModalVisible = true;
          }
        })
        .catch((error) => {
          console.log('error :>> ', error);
        });
    },
    updateAppointment() {
      let appointment = {
        center_id: this.editedAppointment.center.id,
        blood_type: this.editedAppointment.blood_type,
        date: this.editedAppointment.date,
        time: this.editedAppointment.time,
      };
      console.table(appointment);
      axios
        .put(
          `http://127.0.0.1:8000/api/user/appointment/${this.editedAppointment.id}`, appointment, {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getUserToken}`,
          },
        }
        )
        .then((response) => {
          console.log("response :>> ", response);
          this.editedAppointment = {};
          this.showEditModal = false;
          this.fetchAppointments();
        })
        .catch((error) => {
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
        axios
          .delete(`http://127.0.0.1:8000/api/user/appointment/${appointmentId}`, {
            headers: {
              Authorization: `Bearer ${this.$store.getters.getUserToken}`,
            },
          })
          .then((response) => {
            console.log("response :>> ", response);
            this.fetchAppointments();
            useToast().success(response.data.message, {
              timeout: 2000
            });
          })
          .catch((error) => {
            if (error.response.data.message) {
              console.log('message :>> ');
              useToast().error(error.response.data.message, {
                timeout: 2000
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

<style></style>
