<template>
  <div class="container is-fluid padding-top-32">
    <b-field label="Search wine reviews by contry name">
      <b-autocomplete
        rounded
        v-model="countrySearchName"
        :data="filteredCountries"
        placeholder="e.g. jQuery"
        icon="magnify"
        clearable
        @select="onSelectCountry"
      >
        <template slot="empty">Nenhum país encontrado</template>
      </b-autocomplete>
    </b-field>

    <b-table :data="reviews" :loading="isLoading">
      <b-table-column field="points" label="Points" centered v-slot="props">
        {{ props.row.points }}
      </b-table-column>
      <b-table-column field="title" label="Title" centered v-slot="props">
        {{ props.row.title }}
      </b-table-column>
      <b-table-column
        field="description"
        label="Description"
        centered
        v-slot="props"
      >
        {{ props.row.description }}
      </b-table-column>
      <b-table-column
        field="taster_name"
        label="Taster"
        centered
        v-slot="props"
      >
        {{ props.row.taster_name }}/{{ props.row.taster_twitter_handle }}
      </b-table-column>
      <b-table-column field="price" label="price" centered v-slot="props">
        $ {{ props.row.price }}
      </b-table-column>
      <b-table-column
        field="designation"
        label="Designation"
        centered
        v-slot="props"
      >
        {{ props.row.designation }}
      </b-table-column>
      <b-table-column field="variety" label="Variety" centered v-slot="props">
        {{ props.row.variety }}
      </b-table-column>
      <b-table-column field="country" label="Location" v-slot="props">
        {{ props.row.country }}/{{ props.row.province }}
      </b-table-column>
      <b-table-column field="winery" label="Winery" centered v-slot="props">
        {{ props.row.winery }}
      </b-table-column>
    </b-table>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      serverUrl: process.env.VUE_APP_SERVER_URL || "http://localhost:3000",
      countries: [],
      countrySearchName: "",
      selected: null,
      reviews: [],
      isLoading: false,
    };
  },
  mounted: function () {
    console.log(`Server: ${this.serverUrl}`);
    axios
      .get(`${this.serverUrl}/countries`)
      .then(({ data }) => {
        this.countries = data.filter((value) => {
          return value != null;
        });
      })
      .catch((err) => {
        this.$buefy.notification.open({
          duration: 5000,
          message: err.toString(),
          position: "is-bottom-right",
          type: "is-danger",
          hasIcon: true,
        });
      });
  },
  computed: {
    filteredCountries() {
      return this.countries.filter((option) => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(this.countrySearchName.toLowerCase()) >= 0
        );
      });
    },
  },
  methods: {
    clickMe() {
      this.$buefy.notification.open("Clicked!!");
    },
    onSelectCountry(option) {
      this.selected = option;
      if (this.selected != undefined) {
        this.isLoading = true;
        axios
          .post(`${this.serverUrl}/wine/country`, {
            country: this.selected,
          })
          .then(({ data }) => {
            this.reviews = data.hits.map(function (value) {
              return value._source;
            });
            this.isLoading = false;
          })
          .catch((err) => {
            this.$buefy.notification.open({
              duration: 5000,
              message: err.toString(),
              position: "is-bottom-right",
              type: "is-danger",
              hasIcon: true,
            });
            this.isLoading = false;
          });
      }
    },
  },
};
</script>
<style>
.padding-top-32 {
  padding-top: 32px;
}
</style>