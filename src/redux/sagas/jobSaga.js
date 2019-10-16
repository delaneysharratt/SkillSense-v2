import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';
import Swal from 'sweetalert2';

//STUDENT: gets all open jobs
function* fetchAllJobs() {
	try {
		let response = yield axios.get('/api/jobs');
		yield put({
			type: 'SET_ALL_JOBS',
			payload: response.data
		});
	} catch (error) {
		console.log(error);
	}
}

//STUDENT: gets job search results
function* fetchJobSearch(action) {
	try {
		const config = {
			headers: { 'Content-Type': 'application/json' },
			params: action.payload
		};
		let response = yield axios.get(`/api/jobs/search`, config);
		yield put({
			type: 'SET_ALL_JOBS',
			payload: response.data
		});
	} catch (error) {
		console.log(error);
	}
}

//STUDENT: get users current jobs
function* fetchActiveJobs() {
	try {
		let response = yield axios.get('/api/jobs/active');
		yield put({
			type: 'SET_ALL_JOBS',
			payload: response.data
		});
	} catch (error) {
		console.log(error);
	}
}

//STUDENT: get users jobs pending hire
function* fetchAppliedJobs() {
	try {
		let response = yield axios.get('/api/jobs/applied');
		yield put({
			type: 'SET_ALL_JOBS',
			payload: response.data
		});
	} catch (error) {
		console.log(error);
	}
}

//STUDENT: get users job history
function* fetchCompletedJobs() {
	try {
		let response = yield axios.get('/api/jobs/completed');
		yield put({
			type: 'SET_ALL_JOBS',
			payload: response.data
		});
	} catch (error) {
		console.log(error);
	}
}

//CLIENT: gets clients current jobs
function* fetchClientJobs(action) {
	let jobType = action.payload;
	try {
		let response = yield axios.get(`/api/jobs/client/${jobType}`);
		yield put({
			type: 'SET_ALL_JOBS',
			payload: response.data
		});
	} catch (error) {
		console.log(error);
	}
}

//STUDENT OR CLIENT: gets selected job details
function* fetchJobDetail(action) {
	try {
		let response = yield axios.get(`api/jobs/detail/${action.payload.id}`);
		yield put({
			type: 'SET_SELECTED_JOB',
			payload: response.data
		});
	} catch (error) {
		console.log(error);
	}
}

//CLIENT: patch for completed jobs
function* markJobCompleted(action) {
	try {
		yield axios.put(`api/jobs/detail/${action.payload.id}`);
		yield put ({
			type: 'FETCH_CLIENT_JOBS',
			payload: 3
		})
	} catch (error) {
		console.log(error);
	}
}

//CLIENT: posts new job details
function* postJob(action) {
	try {
		yield axios.post('api/jobs/new', action.payload);
		yield put({
			type: 'FETCH_CLIENT_JOBS',
			payload: 3
		})
	} catch (error) {
		console.log(error);
	}
}

//STUDENT: posts job application
function* submitApplication(action) {
	try {
		if (action.payload.file !== null) {
			let file = action.payload.file;
			let fileParts = file.name.split('.');
			let fileName = fileParts[0];
			let fileType = fileParts[1];
			let awsSignedResponse = yield axios.post('/api/upload', {
				fileName: fileName,
				fileType: fileType
			});
			const returnData = awsSignedResponse.data.data.returnData;
			const signedRequest = returnData.signedRequest;
			const url = returnData.url;
			// console.log('url from aws: ', url);
			action.payload.attachment_url = url;
			// console.log('new payload: ', action.payload);
			yield axios.put(signedRequest, action.payload.file, {
				headers: {
					'Content-Type': action.payload.fileType
				}
			});
			yield axios.post('api/jobs/apply', action.payload);
			yield put ({
				type: 'FETCH_ALL_JOBS'
			})
			Swal.fire('Congrats!', 'Your application has been submitted!', 'success');
		} else {
			yield axios.post('api/jobs/apply', action.payload);
			Swal.fire('Congrats!', 'Your application has been submitted!', 'success');
		}
	} catch (error) {
		console.log(error);
	}
}

function* jobSaga() {
	yield takeEvery('FETCH_ALL_JOBS', fetchAllJobs);
	yield takeEvery('FETCH_JOB_SEARCH', fetchJobSearch);
	yield takeEvery('FETCH_ACTIVE_JOBS', fetchActiveJobs);
	yield takeEvery('FETCH_APPLIED_JOBS', fetchAppliedJobs);
	yield takeEvery('FETCH_COMPLETED_JOBS', fetchCompletedJobs);
	yield takeEvery('FETCH_CLIENT_JOBS', fetchClientJobs);
	yield takeEvery('FETCH_JOB_DETAIL', fetchJobDetail);
	yield takeEvery('POST_JOB', postJob);
	yield takeEvery('SUBMIT_APPLICATION', submitApplication);
	yield takeEvery('MARK_JOB_COMPLETED', markJobCompleted);
}

export default jobSaga;
