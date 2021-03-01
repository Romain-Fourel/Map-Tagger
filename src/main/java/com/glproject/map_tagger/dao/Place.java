package com.glproject.map_tagger.dao;

import java.util.List;

import javax.jdo.annotations.PersistenceCapable;

/**
 * This class represent places that users can create, edit and store it into a map
 * @author romain
 *
 */
@PersistenceCapable
public class Place {
	
	//primary key
	Long ID;
	
	String name;
	
	//for now, the location is in a string, maybe a class can be used to handle this better
	String location;
	
	String description;
	List<String> pictures; //not strings, maybe a java class can better handler pictures
	List<String> messages; 
	List<String> tags; //a list of strings which represents tags
	
	

	public Long getID() {
		return ID;
	}
	public void setID(Long iD) {
		ID = iD;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public List<String> getPictures() {
		return pictures;
	}
	public void setPictures(List<String> pictures) {
		this.pictures = pictures;
	}
	public List<String> getMessages() {
		return messages;
	}
	public void setMessages(List<String> messages) {
		this.messages = messages;
	}
	public List<String> getTags() {
		return tags;
	}
	public void setTags(List<String> tags) {
		this.tags = tags;
	}
	
}


