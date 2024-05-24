import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginTop: 5
  },
  titleHighlight: {
    color: '#53b176',
    fontFamily: 'Poppins-Medium'
  },
  ProfileImage: {
    width: 200,
    height: 200,
    borderRadius: 99,
    marginTop: 20
  },
  NameText: {
    fontFamily: 'Poppins-Medium',
    color: '#333',
    fontSize: 23,
    textAlign: 'center',
    marginTop: 5
  },
  EmailText: {
    fontFamily: 'Poppins-Regular',
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5
  },
  button: {
    backgroundColor: '#53b176',
    borderRadius: 27,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    textAlign: 'center'
  },
  signOutContainer: {
    marginTop: 2,
  },
  CreditBtn: {
    backgroundColor: '#53b176',
    borderRadius: 27,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  creditButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    marginLeft: 10
  },
  refreshButton: {
    backgroundColor: '#53b176',
    borderRadius: 27,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  refreshButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginLeft: 10
  },
  icon: {
    marginRight: 5
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center'
  },
  modalText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20
  },
  closeButton: {
    backgroundColor: '#53b176',
    borderRadius: 27,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16
  },
  formModalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center'
  },
  modalTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    marginBottom: 20
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    color: '#333', // This line changes the text color inside the input fields
  },
  imagePickerButton: {
    backgroundColor: '#53b176',
    borderRadius: 27,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10
  },
  imagePickerButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16
  },
  stationImage: {
    width: 100,
    height: 100,
    marginBottom: 20
  },
  submitButton: {
    backgroundColor: '#53b176',
    borderRadius: 27,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10
  },
  submitButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16
  }
});
