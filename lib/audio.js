import * as THREE from 'three';
// song.mp3 from https://upload.wikimedia.org/wikipedia/commons/transcoded/a/ab/Toreador_song.ogg/Toreador_song.ogg.mp3
import songUrl from '../assets/alert.ogg';

const audioLoader = new THREE.AudioLoader();

export const addAudioListenerToCamera = (camera) => {
	camera.add(createAudioListener());
};

export const createAudioListener = () => {
	const listener = new THREE.AudioListener();

	const sound = new THREE.Audio(listener);

	audioLoader.load(songUrl, (buffer) => {

		sound.setBuffer(buffer);
		// sound.setLoop(true);
		sound.setVolume(0.5);
		sound.play();
	});

	return listener;
};
