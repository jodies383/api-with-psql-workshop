document.addEventListener('alpine:init', () => {
    Alpine.data('garment', () => ({

        garments: '',
        garmentsLength: 0,
        genderFilter: '',
        seasonFilter: '',
        maxPrice: 0,
        open: false,
        description: '', 
        price:'', 
        img:'', 
        season:'', 
        gender:'',
 
        toggle() {
            this.open = ! this.open
        },
        getData(){
        axios
            .get(`/api/garments`)
            .then(result => {
                const results = result.data
                this.garments=results.data
                this.garmentsLength=results.data.length

            })
        },
        getDataLength(){
            axios
                .get(`/api/garments`)
                .then(result => {
                    const results = result.data
                    this.garmentsLength=results.data.length
                })
            },
        filterGarments(){
            axios
            .get(`/api/garments?gender=${this.genderFilter}&season=${this.seasonFilter}`)
            .then(result => {
                const results = result.data
                this.garments=results.data
                this.garmentsLength=results.data.length

            })
        },
        filterGarmentsByPrice(){
            axios
            .get(`/api/garments/price/${this.maxPrice}`)
            .then(result => {
                const results = result.data
                this.garments=results.data
                this.garmentsLength=results.data.length

            })
        },
        addGarment(){
            const fields = {
                description: this.description,
                img: this.img,
                price: this.price,
                gender: this.gender,
                season: this.season
                };
            axios
            .post('/api/garment', fields)
            .then(result => {
               this.open=false
               axios
               .get(`/api/garments`)
               .then(result => {
                   const results = result.data
                   this.garments=results.data
               })
               this.description= '', 
               this.price='', 
               this.img='', 
               this.season='', 
               this.gender=''
                // if (result.data.status == 'error') {
                //     showMessage(result.data.message);
                // } else {
                    // toggle();
                    // show success message from API
                    // showMessage(result.data.message);
                    // fieldManager.clear();
                    // show all the data
                //  getData();
                // }
            })
            // .catch(err => {
            //     showMessage(err.stack)
            // });
        },
        


    }));
})