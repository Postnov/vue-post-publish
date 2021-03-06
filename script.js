// Prevent default drop document
;['drop', 'dragenter', 'dragleave', 'dragover'].forEach(function(eventName) {

	document.addEventListener(eventName, function(e) {
		e.preventDefault();
		e.stopPropagation();
	}, false);

});

var PostItem = {
	data() {
		return {
			isEdit: true,
			index: null
		}
	},
	props: ['post'],
	components: {
		VueGallerySlideshow: VueGallerySlideshow
	},
	mounted() {
		// console.log(this.$parent.posts)
	},
	updated() {
		localStorage.setItem('posts', JSON.stringify(this.$parent.posts));
		console.log('post update');
	},

	methods: {
		applyChanges() {
			this.isEdit = !this.isEdit;
		},
		deletePost() {
			this.$parent.posts = this.$parent.posts.filter((item) => this.post.id !== item.id )
		},
		deleteImage(index) {
			this.post.photos = this.post.photos.filter((item, i) => index !== i)
		},
		dropzoneEnable() {
			this.dropzoneIsActive = true;
		},
		dropzoneDisable() {
			this.dropzoneIsActive = false;
		},
		dropZoneDrop(numb) {
			console.log(numb)
			console.log(event)

			var files = event.target.files || event.dataTransfer.files || [] ;

			files = [... files];

			files.forEach((file, index) => {

				var reader = new FileReader();

				reader.onload = (e) => {
					if (index < 10 && this.post.photos.length < 10) {
						this.post.photos.push(e.target.result);
					} else {
						reader.abort();
						return;
					}
				}

				reader.readAsDataURL(file);
			});

			var stringAlert;

			if (files.length > 10 && this.post.photos.length === 0) {
				stringAlert = `You can load only 10 files. Right now you load ${files.length}.\nWill be loaded first 10 files`;
				swal("Error", stringAlert, "error");
			} else if (this.post.photos.length === 10) {
					stringAlert = `Dropzone is crowded and already containts 10 files`;
				swal("Error", stringAlert, "error");
			} else if (files.length + this.post.photos.length > 10 && this.post.photos.length !== 10) {
					stringAlert = `Dropzone is crowded. Image limit - 10.\nWill be loaded ${10 - this.post.photos.length} files from your drop`;
				swal("Error", stringAlert, "error");
			}
		},
	},
	template: `

			<li class="post-list__item">
				<article class="post">
					<div class="post__buttons post-buttons">
						<button @click="isEdit = !isEdit" v-if="!isEdit" class="post-buttons__item">Edit</button>
						<button @click="applyChanges" v-if="isEdit" class="post-buttons__item">Apply</button>
						<button class="post-buttons__item post-buttons__item--danger" @click="deletePost">Delete</button>
					</div>

					<div class="post__img-content">
						<ul v-if="!isEdit" class="post__images-list">
							<li v-for="(item, i) in post.photos" :key="i" class="post__images-item" @click="index = i">
								<img :src="item" alt="" class="post__image">
							</li>
							<vue-gallery-slideshow :images="post.photos" :index="index" @close="index = null"></vue-gallery-slideshow>
						</ul>

						<ul
							v-if="isEdit"
							v-on="{
								dragleave: dropzoneDisable,
								drop: dropZoneDrop(32),
								dragenter: dropzoneEnable,
								dragover: dropzoneEnable}"
							class="post__dropzone post-dropzone">

							<li  v-for="(item, index) in post.photos" :key="index" class="post-dropzone__item">
								<img :src="item" alt="" class="post-dropzone__img">
								<div class="dropzone__overlay" @click="deleteImage(index)">delete image</div>
							</li>
						</ul>
					</div>

					<div class="post__text-content">
						<p v-if="!isEdit" class="post__title">{{ post.title }}</p>
						<input v-if="isEdit" class="post__field" type="text" v-model.lazy="post.title">

						<p v-if="!isEdit" class="post__text">{{ post.text }}</p>
						<textarea v-if="isEdit" class="post__field post__field--textarea" v-model.lazy="post.text"></textarea>
					</div>

				</article>
			</li>
	`
}




var vm = new Vue({
	el: '#app',
	data: {
		dropzoneIsActive: false,
		title: '',
		text: '',
		photos: [],
		posts: JSON.parse(localStorage["posts"] || '[]'),
		postId: JSON.parse(localStorage["lastPostId"] || 0),
	},
	updated() {
		localStorage.setItem('posts', JSON.stringify(this.posts));
		localStorage.setItem('lastPostId', this.postId);
	},
	components: {
		'post-item': PostItem
	},
	methods: {
		deleteImage(index) {
			this.photos = this.photos.filter((item, i) => index !== i)
		},
		addPost() {
			this.posts.push({
				id: this.postId++,
				title: this.title,
				text: this.text,
				photos: this.photos,
			});

			this.title = '';
			this.text = '';
			this.photos = [];

		},
        dropzoneEnable() {
            this.dropzoneIsActive = true;
        },
        dropzoneDisable() {
            this.dropzoneIsActive = false;
        },
        dropZoneDrop() {
			var files = event.target.files || event.dataTransfer.files || [];


			files = [... files];

            files.forEach((file, index) => {

                var reader = new FileReader();

                reader.onload = (e) => {
                    if (index < 10 && this.photos.length < 10) {
                        this.photos.push(e.target.result);
                    } else {
                        reader.abort();
                        return;
                    }
                }

                reader.readAsDataURL(file);
            });

            var stringAlert;

            if (files.length > 10 && this.photos.length === 0) {
                stringAlert = `You can load only 10 files. Right now you load ${files.length}.\nWill be loaded first 10 files`;
                swal("Error", stringAlert, "error");
            } else if (this.photos.length === 10) {
                 stringAlert = `Dropzone is crowded and already containts 10 files`;
                swal("Error", stringAlert, "error");
            } else if (files.length + this.photos.length > 10 && this.photos.length !== 10) {
                 stringAlert = `Dropzone is crowded. Image limit - 10.\nWill be loaded ${10 - this.photos.length} files from your drop`;
				swal("Error", stringAlert, "error");
            }
        },
	}

});

