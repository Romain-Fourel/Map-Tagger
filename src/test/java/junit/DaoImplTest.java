package junit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

import org.junit.Test;

import com.glproject.map_tagger.dao.DAO;
import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.Place;
import com.glproject.map_tagger.dao.User;
import com.glproject.map_tagger.dao.UserDao;
import com.glproject.map_tagger.dao.impl.UserDaoImpl;

public class DaoImplTest {
	
	static void generateMaps(User user) {
		
		for (int i = 0; i < 5; i++) {
			Map map = new Map("user1", "map"+i);
			for (int j = 0; j < 5; j++) {
				Place place = new Place("place"+j);
				map.addPlace(place);
			}
			user.addMap(map);
		}		
	}

	@Test
	public void userTest() {

		PersistenceManagerFactory pmf = JDOHelper.getPersistenceManagerFactory("Glproject");
		UserDao userDao = new UserDaoImpl(pmf);

		User user = new User("Alfred");

		userDao.addUser(user);

		Long id = user.getID();

		User userRetrieved = userDao.getUser(id);
		assertEquals("Alfred", userRetrieved.getName());

		DAO.getUserDao().getUser(id);

		assertTrue(true);
	}

	@Test
	public void usersTest() {
		PersistenceManagerFactory pmf = JDOHelper.getPersistenceManagerFactory("Glproject");
		UserDao userDao = new UserDaoImpl(pmf);

		String[] nameTab = { "Jean", "Alfred", "Eugene", "Eude", "Jacques" };
		List<Long> idList = new ArrayList<Long>();

		for (int i = 0; i < nameTab.length; i++) {
			User user = new User(nameTab[i]);
			userDao.addUser(user);
			idList.add(user.getID());
		}

		assertEquals(nameTab.length + 1, userDao.getUsers().size());
		for (int i = 0; i < idList.size(); i++) {
			assertEquals(nameTab[i], userDao.getUser(idList.get(i)).getName());
		}

	}
	
	@Test
	public void retrieveUsersMapsTest() {
		User user1 = new User("user1", "password1");
		
		generateMaps(user1);
		
		DAO.getUserDao().addUser(user1);		
		
		Long id = user1.getID();
		
		User userRetrieved = DAO.getUserDao().getUser(id);
		
		System.out.println("userRetrieved: "+userRetrieved.getMapList());
		
		assertTrue(userRetrieved.getMapList()!=null);

	}
	
	@Test
	public void retrieveUsersPlaces() {
		
		User user1 = new User("user1", "password1");
		generateMaps(user1);	
		DAO.getUserDao().addUser(user1);
		Long id = user1.getID();	
		User userRetrieved = DAO.getUserDao().getUser(id);
		
		assertTrue(userRetrieved.getMapList()!=null);
		
		for (Map map : userRetrieved.getMapList()) {
			System.out.println(map+" : "+map.getPlaces());
			assertTrue(map.getPlaces()!=null);
		}
		
		
		
	}

}
















