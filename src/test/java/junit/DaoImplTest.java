package junit;
import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

import org.junit.Test;

import com.glproject.map_tagger.dao.DAO;
import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.User;
import com.glproject.map_tagger.dao.UserDao;
import com.glproject.map_tagger.dao.impl.UserDaoImpl;

public class DaoImplTest {

	@Test
	public void userTest() {
		PersistenceManagerFactory pmf = JDOHelper.getPersistenceManagerFactory("Glproject");
		UserDao userDao = new UserDaoImpl(pmf);

		assertTrue(userDao.getUsers("Alfred").isEmpty());

		User user = new User();
		user.setLocation("Paris");
		user.setName("Alfred");
		user.setMapList(new ArrayList<Map>());

		userDao.addUser(user);
		
		assertEquals(1, userDao.getUsers("Alfred").size());
		
		System.out.println(user.getName());
		
		User userRetrieved = userDao.getUsers("Alfred").get(0);
		assertEquals("Alfred", userRetrieved.getName());
		assertEquals("Paris", userRetrieved.getLocation()); 
		
		DAO.getUserDao().getUsers("Alfred");
	}
	
	public void usersTest() {
		PersistenceManagerFactory pmf = JDOHelper.getPersistenceManagerFactory("Glproject");
		UserDao userDao = new UserDaoImpl(pmf);
		
		String[] nameTab = {"Jean","Alfred","Eugene","Eude","Jacques"};
		
		for (int i = 0; i < nameTab.length; i++) {
			userDao.addUser(new User(nameTab[i]));
		}
		
		assertEquals(nameTab.length, userDao.getUsers().size());
		for (String name : nameTab) {
			assertEquals(1, userDao.getUsers(name).size());
			assertEquals(name, userDao.getUsers(name).get(0).getName());
		}
		
	}

}












