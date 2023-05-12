import { axiosInstance } from './axiosInstance';

export const postData = async (formData,data) => {
    try {
        const payload = new FormData();
        payload.append('image', formData.get('image'));
        
        // Append additional data to the payload
        Object.entries(data).forEach(([key, value]) => {
          payload.append(key, value);
        });
        
        const response = await axiosInstance.post("/addMovie",(payload))
        return response.data;
    } catch (error) {
        return error.response
    }
}

export const fetchMovies = async(payload) => {
    try {
        const response = await axiosInstance.get('/fetchMovies')
        return response.data
    } catch (error) {
        return error.response
    }
}

export const getAlldocuments = async() => {
    try {
        const response = await axiosInstance.get('/getAllMovies')
        return response.data
    } catch (error) {
        return error.response
    }
}

export const getDetails = async(payload) => {
    try {
        const response = await axiosInstance.post('/getDetails',(payload))
        return response.data
    } catch (error) {
        return error.response
    }
}

export const editWithoutFile = async(payload) => {
    try {
        const response = await axiosInstance.post('/editMovie',(payload))
        return response.data
    } catch (error) {
        return error.response
    }
}

export const editWithFile = async(formData,data) => {
    try {
        const payload = new FormData();
        payload.append('image', formData.get('image'));

        Object.entries(data).forEach(([key, value]) => {
            payload.append(key, value);
        });

        const response = await axiosInstance.post('/editMovieWithFile',(payload))
        return response.data
    } catch (error) {
        return error.response
    }
}

export const deleteMovie = async(payload) => {
    try {
        const response = await axiosInstance.post('/deleteMovie',(payload))
        return response.data
    } catch (error) {
        return error.response
    }
}