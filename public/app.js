document.addEventListener('alpine:init', () => {
    Alpine.data('garment', () => ({

        garments: '',
        gender: '',
        season: '',

        getData(){
        axios
            .get(`/api/garments`)
            .then(result => {
                const results = result.data
                this.garments=results.data
            })
        },
        filterGarments(){
            axios
            .get(`/api/garments?gender=${this.gender}&season=${this.season}`)
            .then(result => {
                const results = result.data
                this.garments=results.data
            })
        },
        


    }));
})