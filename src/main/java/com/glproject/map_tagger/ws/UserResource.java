package com.glproject.map_tagger.ws;

import java.util.ArrayList;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.User;

@Path("/User")
public class UserResource {
	
	
	/**
	 * An example of implementation of the class user to make the stubs
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/fakeUser")
	public User getUser() {
		User user = new User();
		user.setName("Alfred");
		user.setLocation("Paris");
		user.setMapList(new ArrayList<Map>());
		
		return user;
	}
	
	/**
	 * An example of implementation of the class user to make the stubs
	 * @param user
	 */
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/fakeUser")
	public void retrieveUser(User user) {
		System.out.println("isOK");
		System.out.println(user.getName()+" "+user.getLocation()+" "+user.getMapList());
	}
	
	
}
