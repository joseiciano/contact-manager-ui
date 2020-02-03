﻿import React from 'react';
import axios from 'axios';
import "./ContactCardStyle.scss";


class ContactCard extends React.Component {
    // display in console what the contactCard is getting for props
    componentWillRender() {
        console.log(this.props)
    }

    onDelete()
    {
      let meetupId = this.state.details.id;
      axios.delete(`http://localhost:3000${meetupId}`)
        .then(response => {
          this.props.history.push('/');
        }).catch(err => console.log(err));
    }
    render() {
        // display a contact card
        return (
            <div4>
                <p>
                    <name1> Name: {this.props.name} </name1> <br /> <br />
                    <phone1> Phone: ({this.props.phoneNumber[0]}{this.props.phoneNumber[1]}{this.props.phoneNumber[2]}) {this.props.phoneNumber[3]}{this.props.phoneNumber[4]}{this.props.phoneNumber[5]}-{this.props.phoneNumber[6]}{this.props.phoneNumber[7]}{this.props.phoneNumber[8]}{this.props.phoneNumber[9]}
                    </phone1> <br /> <br />
                    <ad1> Address: {this.props.address}  </ad1>
                </p>
                <button onClick={this.onDelete.bind(this.onDelete)} className = "Delete Button">Delete</button>
            </div4>
        );
    }

}


export default ContactCard;
