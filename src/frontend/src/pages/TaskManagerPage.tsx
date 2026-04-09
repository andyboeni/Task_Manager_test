import { Container, Row, Col, Card, Button, Form, Pagination } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { AddTaskModal } from '../components/AddTaskModal';
import { UpdateTask } from '../components/UpdateTask';
import { TaskCard } from '../components/TaskCard';
import { ErrorMessage } from '../components/ErrorMessage';
import taskApi from '../api/taskApi';
import { Task, TaskFormData, TaskStatus } from '../types/task';

export const TaskManagerPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>('id');
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setError(null);
      const response = await taskApi.getAllTasksWithPagination(
        currentPage,
        itemsPerPage,
        searchTerm,
        sortBy,
        orderBy === 'asc' ? 'asc' : 'desc'
      );
      
      setTasks(response.data.tasks);
      setTotalItems(response.data.totalItems || 0);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Failed to load tasks:', err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [currentPage, itemsPerPage, sortBy, orderBy, searchTerm]);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      setError(null);
      await taskApi.createTask(data);
      await loadTasks();
      setIsAddModalOpen(false);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateTask = async (id: number, data: TaskFormData) => {
    try {
      setError(null);
      await taskApi.updateTask(id, data);
      await loadTasks();
      setSelectedTask(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      setError(null);
      await taskApi.deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h1 className="mb-4">Task Manager</h1>
          
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            Add Task
          </Button>
          
          {error && <ErrorMessage message={error} />}
          
          {selectedTask ? (
            <Card className="mt-4">
              <Card.Header>
                <Card.Title>Edit Task</Card.Title>
              </Card.Header>
              <Card.Body>
                <UpdateTask 
                  task={selectedTask}
                  onSubmit={(data) => handleUpdateTask(selectedTask.id, data)}
                />
                <Button variant="secondary" onClick={() => setSelectedTask(null)} className="mt-3">
                  Cancel
                </Button>
              </Card.Body>
            </Card>
          ) : null}

          <Card className="mt-4">
            <Card.Body>
              <Row className="align-items-center mb-3">
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        setCurrentPage(0);
                        loadTasks();
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <Form.Group controlId="sortBy">
                    <Form.Label>Sort by</Form.Label>
                    <Form.Select
                      value={sortBy}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
                    >
                      <option value="id">ID</option>
                      <option value="title">Title</option>
                      <option value="status">Status</option>
                      <option value="priority">Priority</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group controlId="orderBy">
                    <Form.Label>Order</Form.Label>
                    <Form.Select
                      value={orderBy}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOrderBy(e.target.value as 'asc' | 'desc')}
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group controlId="itemsPerPage">
                    <Form.Label>Items per page</Form.Label>
                    <Form.Select
                      value={itemsPerPage}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(0);
                        loadTasks();
                      }}
                    >
                      {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {tasks.length === 0 ? (
                <p className="text-muted">No tasks found</p>
              ) : (
                <>
                  <Row xs={1} md={2} lg={3} className="g-4">
                    {tasks.map(task => (
                      <Col key={task.id}>
                        <TaskCard 
                          task={task} 
                          onEdit={(task: Task) => setSelectedTask(task)}
                          onDelete={(id: number) => handleDeleteTask(id)}
                        />
                      </Col>
                    ))}
                  </Row>
                  
                  <Pagination className="mt-3">
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                    />
                    <Pagination.Item>{currentPage + 1}</Pagination.Item>
                    <Pagination.Next 
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={(currentPage + 1) * itemsPerPage >= totalItems}
                    />
                  </Pagination>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <AddTaskModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleCreateTask} 
      />
    </Container>
  );
};
