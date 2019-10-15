import React, { Component } from 'react';
import { connect } from 'react-redux';
//material-ui imports
import {
	Typography,
	Paper,
	Button,
	Grid,
	List,
	ListItem,
	ListItemText,
	Divider,
	IconButton
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

//component import
import TwoColumnLayout from '../TwoColumnLayout/TwoColumnLayout';

const styles = theme => ({
	root: {
		display: 'flex'
	},
	messageList: {},
	messageListItem: {}
});

class Messages extends Component {
	state = {
		messages: this.props.messages
	}

	componentDidMount() {
		// gets all accepted mentorship relationships from the server and stores them in the allMentorsReducer
		this.props.dispatch({
			type: 'FETCH_ALL_MESSAGES'
		});
	}

	render() {
		return (
			<TwoColumnLayout leftHeader='Inbox' rightHeader='details'>
				<Grid container justify='center' alignItems='center' spacing={2}>
					<Grid item xs={12}>
						<List>
						{this.props.messages && this.props.messages.map((message, index) => {
							return (
								<ListItem button key={index} onClick={() => {this.setState({selected: message})}}>
									<ListItemText>{message.username}</ListItemText>
								</ListItem>
							)
						})}
							</List>
					</Grid>
				</Grid>
				<Grid container justify='center' alignItems='center' spacing={2}>

				</Grid>
			</TwoColumnLayout>
		);
	}
}

const mapStateToProps = store => {
	return {
		// mentors: store.allMentorsReducer,
		// selectedUser: store.selectedUserReducer,
		user: store.user,
		messages: store.allMessagesReducer
	};
};

export default connect(mapStateToProps)(Messages);
