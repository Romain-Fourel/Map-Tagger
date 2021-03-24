package com.glproject.map_tagger.dao;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

/**
 * This class represent places that users can create, edit and store it into a
 * map
 * 
 * @author romain
 *
 */
@PersistenceCapable
public class Place {

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.NATIVE)
	protected Long id = null;

	String name;

	String description;
	
	double latitude; // the latitude of the place
	double longitude; // the longitude of the place
	
	List<String> pictures; // not strings, maybe a java class can better handler pictures
	List<String> messages;
	List<String> tags; // a list of strings which represents tags

	public Place() {
		super();
		pictures = new ArrayList<String>();
		messages = new ArrayList<String>();
		tags = new ArrayList<String>();
	}
	
	public Place(String name) {
		this();
		this.name=name;
	}
	

	public Place(String name, String description, double latitude, double longitude, List<String> pictures,
			List<String> messages, List<String> tags) {
		super();
		this.name = name;
		this.description = description;
		this.latitude = latitude;
		this.longitude = longitude;
		this.pictures = pictures;
		this.messages = messages;
		this.tags = tags;
	}

	public Long getID() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	
	public void setLocation(double lat, double lng) {
		latitude = lat;
		longitude = lng;
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
	
	public void addPicture(String picturePath) {
		pictures.add(picturePath);
	}
	
	public void addMessage(String message) {
		messages.add(message);
	}
	
	public void addTag(String tag) {
		tags.add(tag);
	}
	
	@Override
	public String toString() {
		return name+" #"+id;
	}
	
	public String toCompleteString() {
		return id+"\n"
			  +name+"\n"
			  +description+"\n"
			  +longitude+" , "+latitude+"\n"
			  +pictures+"\n"
			  +messages+"\n"
			  +tags+"\n";
	}

}



