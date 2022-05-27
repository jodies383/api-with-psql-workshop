document.addEventListener('alpine:init', () => {
    Alpine.data('garment', () => ({

        errorMessage: false,
        successMessage: false,
        garments: '',
        garmentsLength: 0,
        genderFilter: '',
        seasonFilter: '',
        maxPrice: 0,
        open: false,
        description: '',
        price: '',
        img: '',
        season: '',
        gender: '',

        toggle() {
            this.open = !this.open
        },
        getData() {
            axios
                .get(`/api/garments`)
                .then(result => {
                    const results = result.data
                    this.garments = results.data
                    this.garmentsLength = results.data.length

                })
        },
        getDataLength() {
            axios
                .get(`/api/garments`)
                .then(result => {
                    const results = result.data
                    this.garmentsLength = results.data.length
                })
        },
        filterGarments() {
            axios
                .get(`/api/garments?gender=${this.genderFilter}&season=${this.seasonFilter}`)
                .then(result => {
                    const results = result.data
                    this.garments = results.data
                    this.garmentsLength = results.data.length

                })
        },
        filterGarmentsByPrice() {
            axios
                .get(`/api/garments/price/${this.maxPrice}`)
                .then(result => {
                    const results = result.data
                    this.garments = results.data
                    this.garmentsLength = results.data.length

                })
        },

        addGarment() {
            const fields = {
                description: this.description,
                img: this.img,
                price: this.price,
                gender: this.gender,
                season: this.season,
                err: this.errorMessage = true,
                message: this.$refs.errorMessage.innerText = 'garment already exists'
            };

            if (this.description && this.price && this.img && this.season && this.gender !== '') {
                axios
                    .post('/api/garment', fields)
                    .then(result => {
                        this.open = false
                        axios
                            .get(`/api/garments`)
                            .then(result => {
                                const results = result.data
                                this.garments = results.data
                            })
                        this.description = '',
                            this.price = '',
                            this.img = '',
                            this.season = '',
                            this.gender = ''
                    })

            }
            else {

                if (!fields === '') {
                    this.successMessage = true,
                        this.$refs.successMessage.innerText = 'garment added'

                }
                else {
                    if (!this.description) {
                        this.errorMessage = true,
                            this.$refs.errorMessage.innerText = 'missing description information'
                    } else if (!this.price) {
                        this.errorMessage = true,
                            this.$refs.errorMessage.innerText = 'missing price information'
                    } else if (!this.img) {
                        this.errorMessage = true,
                            this.$refs.errorMessage.innerText = 'missing img information'
                    } else if (!this.season) {
                        this.errorMessage = true,
                            this.$refs.errorMessage.innerText = 'missing season information'
                    } else if (!this.gender) {
                        this.errorMessage = true,
                            this.$refs.errorMessage.innerText = 'missing gender information'
                    }
                }
            }
            setTimeout(() => { this.successMessage = false }, 2000);
            setTimeout(() => { this.errorMessage = false }, 2000);
        },
        deleteGarment(description) {
            axios
                .delete(`/api/garments?description=${description}`)
                .then(result => {

                    axios
                        .get(`/api/garments`)
                        .then(result => {
                            const results = result.data
                            this.garments = results.data
                            this.garmentsLength = results.data.length
                            this.successMessage = true,
                                this.$refs.successMessage.innerText = 'garment deleted'
                            setTimeout(() => { this.successMessage = false }, 2000);
                        })
                })
        },


    }));
})