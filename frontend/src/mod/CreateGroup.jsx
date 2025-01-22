import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { ChatState } from "../context/Chatcontext";
import { set } from "react-hook-form";

const CreateGroup = ({ onClose }) => {
  const { user, refresh, setRefresh } = ChatState();
  const [modalShow, setModalShow] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSearch = async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:8000/search?search=${searchQuery}`,
        config
      );
      setSearchResults(response.data); // Assuming the response data contains user info
    } catch (e) {
      console.error("Error searching users:", e);
    }
  };

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.some((user) => user._id === userToAdd._id)) {
      alert("User is already added.");
      return;
    }
    setSelectedUsers((prevSelected) => [...prevSelected, userToAdd]);
  };

  const handleRemoveUser = (userToRemove) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.filter((user) => user._id !== userToRemove._id)
    );
  };
    const handleClose = () => {
      setGroupName("");
      setSearchQuery("");
      setSearchResults([]);
      setSelectedUsers([]);
      setModalShow(false);
      if (onClose) {
        onClose();
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (groupName.trim() === "" || selectedUsers.length === 0) {
      alert("Please provide a group name and select users.");
      return;
    }
    if (selectedUsers.length < 2) {
      alert("A group must have at least two users.");
      return;
    }
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const users = selectedUsers.map((user) => user._id);
      users.push(user._id);
      const newGroupData = {
        groupName,
        users: users,
        admin: user,
      };

      const response = await axios.post(
        "http://localhost:8000/create-group",
        newGroupData,
        config
      );
      if (response.status === 201) {
        alert("Group created successfully!");
        handleClose();
        setModalShow(false);
        setRefresh(!refresh);
      }
    } catch (error) {
    alert("error creating group",error);
      console.error("Error creating group:", error);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setModalShow(true)}
        className="btn-sm"
      >
        Create Group
      </Button>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create Group
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Group Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Search Users</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-info btn-sm mt-2"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>

            {searchResults && searchResults.length > 0 && (
              <div className="search-results mt-2">
                <h5>Search Results</h5>
                <ul className="list-group">
                  {searchResults.map((user) => (
                    <li
                      key={user._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {user.name}
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleAddUser(user)}
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedUsers.length > 0 && (
              <div className="selected-users mt-2">
                <h5>Selected Users</h5>
                <ul className="list-group">
                  {selectedUsers.map((user) => (
                    <li
                      key={user._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {user.name}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveUser(user)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="form-group mt-3">
              <button type="submit" className="btn btn-primary btn-block">
                Create Group
              </button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateGroup;
