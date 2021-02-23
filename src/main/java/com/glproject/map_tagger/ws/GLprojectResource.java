package com.glproject.map_tagger.ws;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/glproject")
public class GLprojectResource {
	
	public static class UserClass{
		String field;
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/user")
	public UserClass getUser() {
		UserClass user = new UserClass();
		user.field = "test";
		return user;
	}
	
}





