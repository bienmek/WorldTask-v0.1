import axios from 'axios';

const API_KEY = 'AIzaSyDIcHeHnQUCLtXZh0SeU_xPle5FEXQpTyQ';

export const getAddress = async (lat, lng) => {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`);

        if (response.data.status === 'OK') {
            const addressComponents = response.data.results[0].address_components;
            let streetNumber
            let streetName
            let city
            let departement
            let region
            let country

            addressComponents.map((addressComponent) => {
                if (addressComponent.types[0].includes("street_number")) {
                    streetNumber = addressComponent.long_name
                }

                if (addressComponent.types[0].includes("route")) {
                    streetName = addressComponent.long_name
                }

                if (addressComponent.types[0].includes("locality")) {
                    city = addressComponent.long_name
                }

                if (addressComponent.types[0].includes("administrative_area_level_1")) {
                    departement = addressComponent.long_name
                }

                if (addressComponent.types[0].includes("administrative_area_level_2")) {
                    region = addressComponent.long_name
                }

                if (addressComponent.types[0].includes("country")) {
                    country = addressComponent.long_name
                }
            })

            return {lat, lng, streetNumber, streetName, city, departement, region, country}
        } else {
            console.error(response.data.status);
        }
    } catch (error) {
        console.error(error);
    }
}