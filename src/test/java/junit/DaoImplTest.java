package junit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

import org.junit.Test;

import com.glproject.map_tagger.dao.DAO;
import com.glproject.map_tagger.dao.User;
import com.glproject.map_tagger.dao.UserDao;
import com.glproject.map_tagger.dao.impl.UserDaoImpl;

public class DaoImplTest {

	@Test
	public void userTest() {

		PersistenceManagerFactory pmf = JDOHelper.getPersistenceManagerFactory("Glproject");
		UserDao userDao = new UserDaoImpl(pmf);

		User user = new User("Alfred");
		user.setLocation("Paris");

		userDao.addUser(user);

		Long id = user.getID();

		User userRetrieved = userDao.getUser(id);
		assertEquals("Alfred", userRetrieved.getName());
		assertEquals("Paris", userRetrieved.getLocation());

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

}
