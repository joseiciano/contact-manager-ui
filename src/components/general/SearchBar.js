import React, { useState, useEffect } from "react";
import axios from "axios";
import Magnifying_Glass from "../../icons/magnifying_glass.png";
import ContactCard from "./ContactCard";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const SearchList = ({ list }) => {
  return list.map((x, idx) => (
    <ContactCard
      key={x.id}
      name={x.data.name ? x.data.name : ""}
      address={x.data.address ? x.data.address : ""}
      phoneNumber={x.data.phoneNumber ? x.data.phoneNumber : ""}
    />
  ));
};

const SearchBar = () => {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in, use their uid for getting their contacts
        let uid = user.uid;
        console.log(uid);
        // This is done for initial screen rendering, not used for searching
        let hyper =
          "https://cors-anywhere.herokuapp.com/https://us-central1-contact-manager-98599.cloudfunctions.net/webAPI/api/v1/users/" +
          uid +
          "/contacts";
        console.log(hyper);
        //debugger;
        axios.get(hyper).then(res => {
          let init = [];
          res.data.forEach(x => {
            init.push({ id: x.id, data: x.data });
          });
          setAccounts(init);
          setUserID(uid);
        });
      } else {
      }
    });
  }, []);

  const handleSearch = e => {
    setSearch(e);
  };

  const doSearch = e => {
    handleSearch(e.target.value);
    console.log(search);
    const searchedAccounts = [];
    if (e.target.value === "") {
      firebase
        .firestore()
        .collection(`users/${userID}/contacts`)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            searchedAccounts.push({
              id: doc.id,
              data: {
                name: doc.data().name,
                address: doc.data().address,
                phoneNumber: doc.data().phoneNumber
              }
            });
          });
          setAccounts(searchedAccounts);
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    } else {
      firebase
        .firestore()
        .collection(`users/${userID}/contacts`)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            // console.log(doc.data());

            let name = doc.data().name;
            let address = doc.data().address;
            let phoneNumber = doc.data().phoneNumber;

            if (
              (name && name.toLowerCase().includes(search.toLowerCase())) ||
              (phoneNumber && phoneNumber.includes(search.toLowerCase())) ||
              (address && address.toLowerCase().includes(search.toLowerCase()))
            )
              searchedAccounts.push({
                id: doc.id,
                data: {
                  name: name,
                  address: address,
                  phoneNumber: phoneNumber
                }
              });
          });
          setAccounts(searchedAccounts);
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    }
  };

  return (
    <div>
      <div className="SearchBar" style={styles.searchWrapper}>
        <i style={styles.imageWrapper} onClick={() => console.log("dank")}>
          <img src={Magnifying_Glass} style={styles.image} />
        </i>
        <input
          style={styles.searchbar}
          value={search}
          placeholder="Search"
          onChange={doSearch}
        ></input>
      </div>
      <div className="SearchList">
        <SearchList list={accounts} search={search} />
      </div>
    </div>
  );
};

const styles = {
  searchWrapper: {
    margin: "auto",
    width: "80%"
  },
  searchbar: {
    positon: "relative",
    width: "76.5%",
    borderRadius: "3px",
    textAlign: "left",
    height: "40px",
    marginTop: "0px",
    paddingRight: "10px",
    paddingLeft: "15px",
    // position from left of page
    marginLeft: "6.6%",
    // This makes the text go to the right of the search button
    padding: "12px 43px"
  },
  imageWrapper: {
    position: "relative",
    padding: "10px",
    pointerEvents: "none"
  },
  image: {
    width: "3.8%",
    height: "3.8%",
    position: "relative",
    bottom: "3px",
    left: "11.5%"
  }
};

export default SearchBar;
